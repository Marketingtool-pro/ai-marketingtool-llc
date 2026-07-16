#!/usr/bin/env ruby
# ==============================================================================
# Ai marketingtool llc PROJECT SCANNER & AUTO-FIXER (v2.5)
# Purpose: Scans real projects in ~/Developer, ensures .sh scripts are
# executable, and audits Firebase config.
#
# v2.5: junk removal REMOVED — it duplicated setup_master.sh section 8
#       (which already deletes .DS_Store / crash dumps before this runs), so
#       this scanner re-"removed" the same files and printed a misleading
#       "Removed N junk files" line on every run. Scanner now only audits.
#
# v2.4: post-2026-07-05 clean — SKIP_DIRS covers the Xcode/system dirs that
# live at ~/Developer root (CoreSimulator, CommandLineTools, CoreDevice, ...)
# and credentials_backup (now a SYMLINK into ~/.secrets — never walk the
# vault). Labels updated to the two real repos.
#
# v2.3: junk removal now also matches glob patterns (JUNK_GLOBS) so multi-GB
# crash dumps (*.hprof, hs_err_pid*.log) get swept, not just exact-name files.
#
# v2.2: recursive walks now PRUNE heavy/irrelevant subtrees (node_modules,
# .ipynb_checkpoints, chromium, build dirs, ...). Previously SKIP_DIRS only
# filtered TOP-LEVEL entries while the **-globs still descended into every
# nested node_modules/chromium tree — slow, and it touched files it shouldn't.
# ==============================================================================

require 'fileutils'
require 'find'
require 'shellwords'

DEVELOPER_ROOT = File.expand_path("~/Developer")

# A directory counts as one of OUR projects only if it's a git repo whose
# `origin` remote belongs to the org/user below. This is what stops the scan
# from reporting "43 projects scanned": ~/Developer is full of upstream clones
# (containers/podman, opencontainers/runc, swagger-api/swagger-codegen,
# macports-*, modelcontextprotocol/ext-apps, ...) that are NOT our projects.
# Local-only repos (no remote) are matched via the `labels` allowlist instead.
# Added 2026-07-12 — the old walk counted every non-skipped dir as a project.
OWNER_PATTERN = /marketingtool|Lokeninfinitypoint/i

# Directories at root of Developer that are NOT real projects — skip them
SKIP_DIRS = %w[
  .rbenv .cargo .rustup .gradle .kube .azure .gsutil
  .ipynb_checkpoints .jupyter .vscode .claude .cagent .pi
  .nsolid-bundle .ext .vite-plus .mise .nvm
  google-cloud-sdk funcion path prism build doc spec src node_modules target
  chromium
  CoreSimulator CommandLineTools CoreDevice DeveloperDiskImages
  PrivateFrameworks DeviceKit credentials_backup
  vendor MacPorts-2.12.5 DockerDesktop
].freeze
# vendor/ added 2026-07-09: MacPorts build vendor dir at Developer root holds
# ROOT-OWNED tcl files — chmod there always fails with "Operation not permitted".
# It's build output + bundler gems, not a project. Same for MacPorts-2.12.5
# (extracted release source) and DockerDesktop (just the live Docker.raw VM disk).

# Third-party/upstream clones — NEVER chmod their scripts. The bulk +x sweep
# shows up as hundreds of tracked mode-change diffs (found 2026-07-09: podman
# 97 dirty, macports-ports 100 dirty, all 100644→100755 from this scanner).
# Junk cleanup still runs on them (.DS_Store etc. is untracked, harmless).
UPSTREAM_DIRS = %w[
  podman macports-ports macports-webapp macports-guide autoconf alerter
  podman-desktop-demo MacPorts-2.12.5
].freeze

# Nested directory NAMES to PRUNE during recursive walks (any depth).
# Never descend into these — they are huge, generated, or irrelevant.
PRUNE_DIRS = %w[
  node_modules .git .ipynb_checkpoints chromium Pods
  build dist target out .next .nuxt .output .gradle
  .venv venv vendor DerivedData .terraform __pycache__
  .cache .expo .dart_tool .svelte-kit coverage
].freeze

# Path SUBSTRINGS to prune — dependency/toolchain caches that aren't a single
# dir name (e.g. the Go module cache lives at <gopath>/pkg/mod). Editing files
# inside these is wrong (Go verifies module cache integrity) and very slow.
PRUNE_PATH_SUBSTRINGS = %w[
  /go/pkg/mod /.cargo/registry /.cargo/git /.rustup/toolchains
  /.pub-cache /.cocoapods/repos
].freeze

def log(message, type = :info)
  prefix = { info: "🔵 [INFO]", fix: "✅ [FIXED]", warn: "⚠️  [WARN]", error: "❌ [ERROR]", audit: "🔍 [AUDIT]" }
  puts "#{prefix[type]} #{message}"
end

# Walk `path` yielding each FILE, pruning PRUNE_DIRS subtrees so we never
# descend into node_modules/chromium/etc. Errors on unreadable dirs are logged,
# not fatal.
def each_file_pruned(path)
  Find.find(path) do |entry|
    if File.directory?(entry)
      if !File.readable?(entry)
        log("Directory not readable: #{entry}", :warn)
        Find.prune
        next
      end
      prune = (PRUNE_DIRS.include?(File.basename(entry)) && entry != path) ||
              PRUNE_PATH_SUBSTRINGS.any? { |s| entry.include?(s) }
      Find.prune if prune
      next
    end
    yield entry
  end
rescue => e
  log("walk error in #{File.basename(path)}: #{e.message}", :warn)
end

# True if a file named `name` exists anywhere under `path` (pruned, short-circuits).
def contains_file?(path, name)
  each_file_pruned(path) { |f| return true if File.basename(f) == name }
  false
end

# True only if `path` is a git repo whose origin remote is one of ours
# (matches OWNER_PATTERN). Upstream clones and no-remote scratch repos → false.
def owned_repo?(path)
  return false unless File.directory?(File.join(path, ".git"))
  url = `git -C #{Shellwords.escape(path)} remote get-url origin 2>/dev/null`.strip
  !url.empty? && !(url =~ OWNER_PATTERN).nil?
end

def ensure_scripts_executable(path)
  each_file_pruned(path) do |script|
    next unless script.end_with?('.sh')
    unless File.executable?(script)
      begin
        FileUtils.chmod("+x", script)
        log("Made executable: #{script.sub(DEVELOPER_ROOT + '/', '')}", :fix)
      rescue => e
        log("Failed to make executable #{script.sub(DEVELOPER_ROOT + '/', '')}: #{e.message}", :warn)
      end
    end
  end
end

def audit_firebase(path)
  found = []
  found << "google-services.json" if contains_file?(path, "google-services.json")
  found << "GoogleService-Info.plist" if contains_file?(path, "GoogleService-Info.plist")
  found << "firebase.json" if File.exist?(File.join(path, "firebase.json"))

  if found.any?
    log("Firebase detected: #{found.join(', ')}", :audit)
  else
    log("No Firebase config found (Check if intentional)", :warn) if path.downcase.include?("phone") || path.downcase.include?("llc")
  end
end

def scan_projects
  unless Dir.exist?(DEVELOPER_ROOT)
    log("Developer directory not found at #{DEVELOPER_ROOT}", :error)
    return
  end

  log("Scanning real projects in #{DEVELOPER_ROOT}...")
  scanned = 0
  skipped = 0

  # Mapping for better logging
  # Keys = repo names verified via `gh api orgs/Marketingtool-pro/repos`
  # 2026-07-06. The org API lists 21 repos, but only 5 are REAL projects —
  # the rest are forks, archived copies, and Copilot-agent experiments
  # (my-tanstack-app, laravel, starter-workflows, bug-free-space-trout, ...).
  # Only AiMarketingtool-pro-fbaf2fad has the self-hosted Actions runner.
  labels = {
    # ── the 5 real repos ──
    "AiMarketingtool-pro-fbaf2fad"      => "Phone App (Main — Actions runner)",
    "web-app-router-"                   => "Web App (Router, VPS2 — off-limits)",
    "agent-claude"                      => "Agent Claude (Cloud Run)",
    "ai-marketingtool-llc"              => "Org/LLC Repo",
    "marketingtool-app"                 => "Marketingtool App",
    # ── secondary / local-only folder names ──
    "Marketingtool-pro_web-app-router-" => "Web App (local clone)",
    "mt-deploy"                         => "Deploy Repo (config only)"
  }

  Dir.foreach(DEVELOPER_ROOT) do |entry|
    next if entry == '.' || entry == '..'
    next if SKIP_DIRS.include?(entry)
    next if entry.start_with?('.') # skip any hidden dir
    next if entry.include?('.backup-') # skip backup folders

    project_path = File.join(DEVELOPER_ROOT, entry)
    next unless File.directory?(project_path)

    # Only OUR projects: in the labels allowlist, or a git repo with our remote.
    # Everything else (upstream clones, unrelated scratch dirs) is skipped and
    # tallied — an honest count instead of the old fake "43 projects scanned".
    unless labels.key?(entry) || owned_repo?(project_path)
      skipped += 1
      next
    end

    label = labels[entry] || "Marketingtool-pro repo"
    log("Project: #{entry} [#{label}]")
    ensure_scripts_executable(project_path) unless UPSTREAM_DIRS.include?(entry)
    audit_firebase(project_path)

    # Special case: nested projects in 'all function action'
    if entry == 'all function action'
      Dir.foreach(project_path) do |subentry|
        next if subentry == '.' || subentry == '..'
        next if subentry.start_with?('.')
        subproject_path = File.join(project_path, subentry)
        next unless File.directory?(subproject_path)
        next if PRUNE_DIRS.include?(subentry)

        sublabel = labels[subentry] || "Nested Project"
        log("  > Sub-Project: #{subentry} [#{sublabel}]")
        ensure_scripts_executable(subproject_path)
        audit_firebase(subproject_path)
      end
    end

    scanned += 1
  end

  log("Done — #{scanned} projects scanned (#{skipped} non-org dirs skipped).")
end

scan_projects if __FILE__ == $0
