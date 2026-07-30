#!/usr/bin/env ruby
# ==============================================================================
# Ai marketingtool llc PROJECT SCANNER & AUTO-FIXER (v2.8)
# Purpose: FULL scan of the project folder(s) — lists every directory (no
# "skipped" filter), removes regenerable junk, makes .sh executable, audits
# Firebase.
#
# v2.8: user wants the project folder fully scanned with junk zeroed. Every
# top-level dir is now listed (no owner-filter/"88 skipped"); regenerable junk
# (.DS_Store, crash dumps, debug logs) is DELETED across the whole tree; chmod
# still runs only where safe (our repos + plain folders, never inside a
# third-party git clone — that created 189 dirty mode-diffs before).
#
# v2.6: multi-root scan — ~/Developer holds only ONE of the 5 real repos; the
#       org repo (~/ai-marketingtool-llc) and the clones nested inside it were
#       never scanned. Also fixed a fatal NameError in the chmod log lines
#       ("AI MARKETINGTOOL LLC_ROOT", a botched rename of DEVELOPER_ROOT —
#       parses as nested method calls, so ruby -c never caught it).
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

# v2.6: the 5 real repos no longer all live under ~/Developer — the org repo
# (~/ai-marketingtool-llc) and the clones nested INSIDE it (Phone App,
# Marketingtool-pro_web-app-router-) were invisible to the scan, so
# "1 projects scanned" looked fake when it was really an incomplete root list.
# Scan every root; a root that is itself an owned repo counts as a project.
SCAN_ROOTS = [
  DEVELOPER_ROOT,
  File.expand_path("~/ai-marketingtool-llc"),
].freeze

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
  tmp
].freeze
# tmp added 2026-07-17: a scratch dir named "tmp" is not a project even when
# it happens to contain a git repo with an org remote.
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
  spack spack-packages local-path-provisioner googleapis swagger-codegen
  choosealicense.com macports-base crc devtools-frontend ext-apps
  toolbox skaffold sbt openshift-install-mac openshift-client-mac
].freeze
# Second batch added 2026-07-17 after the v2.7 FULL root scan chmodded scripts
# inside spack-packages (upstream clones at the llc root — remotes verified:
# spack/spack-packages.git, rancher/local-path-provisioner, ...). Mode diffs
# were reverted; keep these pruned from the chmod sweep forever.

# Nested directory NAMES to PRUNE during recursive walks (any depth).
# Never descend into these — they are huge, generated, or irrelevant.
PRUNE_DIRS = %w[
  node_modules .git .claude .ipynb_checkpoints chromium Pods
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

# Regenerable JUNK removed on every scan (v2.8 — user wants junk zeroed in the
# project folder). Exact-name matches + glob-matched crash dumps / debug logs.
# All of these are OS cruft or tool output that regenerates on demand — never
# source. Deleting them is safe even inside git repos (they're untracked).
JUNK_FILES = %w[.DS_Store Thumbs.db .DS_Store? ._.DS_Store desktop.ini].freeze
JUNK_GLOBS = %w[*.hprof hs_err_pid*.log replay_pid*.log npm-debug.log*
                yarn-error.log ._* .Trashes].freeze

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

# Delete regenerable junk under `path`. Returns [files_removed, bytes_freed].
# Only touches JUNK_FILES / JUNK_GLOBS matches — never source.
def clean_junk(path)
  n = 0; bytes = 0
  each_file_pruned(path) do |f|
    base = File.basename(f)
    junk = JUNK_FILES.include?(base) || JUNK_GLOBS.any? { |g| File.fnmatch?(g, base) }
    next unless junk && File.file?(f)
    begin
      bytes += File.size(f)
      FileUtils.rm(f)
      n += 1
    rescue => e
      log("Failed to remove junk #{base}: #{e.message}", :warn)
    end
  end
  log("Removed #{n} junk files (#{'%.1f' % (bytes / 1024.0)} KB) from #{File.basename(path)}", :fix) if n > 0
  [n, bytes]
end

def ensure_scripts_executable(path)
  each_file_pruned(path) do |script|
    next unless script.end_with?('.sh')
    # Never chmod inside third-party clones nested ANYWHERE under the walk —
    # the bulk +x sweep shows up as hundreds of tracked mode-change diffs
    # (same disease UPSTREAM_DIRS documents at the entry level).
    next if script.split(File::SEPARATOR).any? { |seg| UPSTREAM_DIRS.include?(seg) }
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
    # Match the project's NAME, not the full path: under the ~/ai-marketingtool-llc
    # scan root EVERY path contains "llc", which made this warn about Firebase
    # for docs repos, Apple samples, tmp, ... (wrong suggestion, found 2026-07-17).
    name = File.basename(path).downcase
    log("No Firebase config found (Check if intentional)", :warn) if name.include?("phone") || name.include?("llc")
  end
end

def scan_projects
  scanned = 0
  total_junk = 0
  total_bytes = 0

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

  SCAN_ROOTS.each do |root|
    unless Dir.exist?(root)
      log("Scan root not found: #{root}", :error)
      next
    end
    log("Scanning #{root} (full — every directory)...")

    # The root's OWN top-level scripts (shallow: its child dirs are each scanned
    # below, so we never walk the whole tree twice) + audit the root repo.
    root_owned = owned_repo?(root)
    if root_owned
      Dir.glob(File.join(root, "*.sh")).each do |s|
        next if File.executable?(s)
        begin
          FileUtils.chmod("+x", s)
          log("Made executable: #{s.sub(root + '/', '')}", :fix)
        rescue => e
          log("chmod failed #{File.basename(s)}: #{e.message}", :warn)
        end
      end
      rn = File.basename(root)
      log("Project: #{rn} [#{labels[rn] || 'Marketingtool-pro repo'}] (scan root — full clean)")
      # Junk removal over the WHOLE root tree (this is the project folder the
      # user wants zeroed). Runs once here; child dirs below skip re-cleaning
      # our own tree, and third-party clones are cleaned via their own entry.
      jn, jb = clean_junk(root)
      total_junk += jn; total_bytes += jb
      audit_firebase(root)
      scanned += 1
    end

    # EVERY top-level directory is scanned and listed — no owner filter, no
    # "skipped" count (the user wants full coverage). chmod only runs where it
    # is SAFE: our repos and plain non-git folders. A third-party git clone is
    # LISTED but never chmod'd/walked, because a bulk +x sweep there shows up as
    # hundreds of tracked mode-change diffs (spack, googleapis, ... — verified).
    Dir.foreach(root) do |entry|
      next if entry == '.' || entry == '..'
      next if SKIP_DIRS.include?(entry)
      next if entry.start_with?('.') # skip any hidden dir
      next if entry.include?('.backup-') # skip backup folders

      path = File.join(root, entry)
      next unless File.directory?(path)

      ours = labels.key?(entry) || owned_repo?(path)
      third_party_git = !ours && File.directory?(File.join(path, '.git'))

      if third_party_git
        log("Project: #{entry} [third-party clone — listed, not modified]")
      else
        log("Project: #{entry} [#{labels[entry] || (ours ? 'Marketingtool-pro repo' : 'directory')}]")
        ensure_scripts_executable(path) unless UPSTREAM_DIRS.include?(entry)
        audit_firebase(path)
      end
      # Junk removal for children only when the root itself was NOT full-cleaned
      # above (i.e. ~/Developer) — for the owned project root, clean_junk(root)
      # already swept the entire tree including these children.
      unless root_owned
        jn, jb = clean_junk(path)
        total_junk += jn; total_bytes += jb
      end
      scanned += 1
    end
  end

  log("Done — #{scanned} dirs scanned (full coverage), #{total_junk} junk files removed (#{'%.1f' % (total_bytes / 1024.0)} KB).")
end

scan_projects if __FILE__ == $0
