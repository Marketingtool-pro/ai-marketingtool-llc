#!/bin/zsh
# ==============================================================================
# MASTER SETUP & MAINTENANCE (v2.7)
# v2.7: killed the daily "gh token missing read:packages" nag — replaced the
#       x-oauth-scopes header check with a FUNCTIONAL npm-whoami check after
#       the token write (fine-grained org tokens have no classic scopes AND
#       npm.pkg.github.com only accepts classic tokens, so the old check
#       could never clear). Fixed ~/.npmrc token write (grep matched the
#       @scope:registry line → token line was NEVER written). Clasp key path
#       → ~/.secrets vault (Developer/credentials_backup is gone); no warn
#       when the bypass is already active. Scanner path → repo copy fallback.
#       Guarded 4 more set-e landmines (gh token/user, mise reshim,
#       firebase login:list, npm whoami).
# v2.6: removed container-runtime section (podman + docker) — not used here;
#       dropped their VERSIONS lines. Junk removal now lives ONLY in section 8
#       (shell); Developer.rb audits, it no longer re-deletes the same files
#       (that duplicate produced the misleading "Removed N" line every run).
# v2.5: fix silent mid-run death in section 8b — `xcrun simctl runtime list`
#       exits 72 without full Xcode and the unguarded assignment under `set -e`
#       aborted the script at "Reclaiming macOS disk" (sections 9+ never ran).
# v2.4: post-2026-07-05 full-mac clean. SDKMAN retired (Java = Temurin
#       JAVA_HOME + mise); sweep duplicate tool-homes that installers keep
#       re-creating (~/.mise, ~/Developer/{.rustup,.nvm,CommandLineTools});
#       Chrome cache clear; iOS sim runtime prune (keep newest only);
#       credentials now live in ~/.secrets (credentials_backup is a symlink).
# v2.3: crash-safe `mise prune` (logger SIGABRT fallback) + macOS disk
#       reclamation (crash dumps, wallpaper aerials, unused Android images) +
#       run_timeout watchdog on `gem update` (was hanging on dead rubygems socket).
# Local: mise · npm · gem · gcloud · gh · junk cleanup
# Packages: GitHub Packages @marketingtool-pro (npm + Ruby gems)
# Accounts: gh · gcp · firebase · npm
# VPS: auto SSH key + full update (both servers)
# Org: Marketingtool-pro | Help@marketingtool.pro
# ==============================================================================
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo "${GREEN}✅  $1${NC}"; }
warn() { echo "${YELLOW}⚠️   $1${NC}"; }
info() { echo "${BLUE}➜   $1${NC}"; }
fail() { echo "${RED}❌  $1${NC}"; }
hr()   { echo "──────────────────────────────────────────────"; }

# run_timeout SECONDS cmd... — kills cmd if it exceeds SECONDS. No coreutils
# `timeout` dep (none on this Mac). Added v2.3 after `gem update` hung 35 min
# on a CLOSE_WAIT socket to rubygems.org (RubyGems has no network timeout).
# `emulate -L zsh` makes `set -e` local-off so a timed-out child can't abort us.
run_timeout() {
  emulate -L zsh
  local _t=$1; shift
  "$@" &
  local _pid=$!
  ( sleep "$_t"; kill -TERM "$_pid" 2>/dev/null ) &!
  local _wd=$!
  wait "$_pid"; local _rc=$?
  kill -TERM "$_wd" 2>/dev/null
  return $_rc
}

GITHUB_ORG="Marketingtool-pro"

echo ""; hr
echo "  MASTER SETUP — Marketingtool-pro"
hr; echo ""

# ── 1. GIT IDENTITY ───────────────────────────────
info "Git org identity..."
git config --global user.name  "Marketingtool-pro"
git config --global user.email "Help@marketingtool.pro"
ok "Git → Marketingtool-pro <Help@marketingtool.pro>"

# ── 2. SDKMAN (RETIRED 2026-07-05) ────────────────
# Deleted in the full-mac clean — Java comes from Temurin (JAVA_HOME in
# .zprofile) + mise. A second SDK manager just re-creates the duplicate-home
# problem. If it reappears, an installer snuck it back in — remove it.
if [[ -d "$HOME/.sdkman" ]]; then
  warn "SDKMAN reappeared (retired 2026-07-05) — removing"
  rm -rf "$HOME/.sdkman"
else
  ok "SDKMAN retired (Java = Temurin + mise)"
fi

# ── 3. MISE ───────────────────────────────────────
info "Mise update, upgrade & reshim..."
# `enable_tools = []` in a mise.toml [settings] is an EMPTY ALLOWLIST — it
# silently disables EVERY tool for that dir and below. Found 2026-07-06 in
# ~/Developer/mise.toml: it dropped all repo shells onto system Ruby 2.6
# (Gem::FilePermissionError on /Library/Ruby/Gems/2.6.0) and killed every
# mise shim (gcloud, ruby, gem, ...). Sweep it wherever it reappears.
for _cfg in ~/Developer/mise.toml ~/mise.toml ~/.config/mise/config.toml; do
  if [[ -f "$_cfg" ]] && grep -q '^enable_tools = \[\]' "$_cfg"; then
    sed -i '' '/^enable_tools = \[\]/d' "$_cfg"
    warn "Removed enable_tools=[] (disables ALL tools) from $_cfg"
  fi
  # A global NODE_ENV=production in any mise [env] makes every npm/yarn/bun
  # install skip devDependencies — both apps' node_modules ended up EMPTY and
  # nothing could build. Found 2026-07-09 in ~/mise.toml AND
  # ~/.config/mise/config.toml; installers/agents may re-add it. Sweep it.
  if [[ -f "$_cfg" ]] && grep -q '^NODE_ENV = "production"' "$_cfg"; then
    sed -i '' '/^NODE_ENV = "production"/d' "$_cfg"
    warn "Removed global NODE_ENV=production (kills devDependency installs) from $_cfg"
  fi
  # A mise [deps] block with `auto = true` auto-runs bun/yarn/pnpm/bundler
  # install on EVERY mise activation and prints to STDOUT — which pollutes every
  # command substitution. Found 2026-07-17: it poisoned the `_RUBY_VER=$(mise
  # exec ... ruby -e 'print RUBY_VERSION')` capture below, writing pages of
  # "[deps.bun] bun install..." garbage into ~/.ruby-version, which then made
  # mise error on EVERY subsequent command (self-perpetuating). It also leaked
  # the gh token in plaintext (pnpm fetching the old @marketingtool/developer).
  # Disable it wherever it reappears.
  if [[ -f "$_cfg" ]] && grep -q 'auto = true' "$_cfg"; then
    sed -i '' 's/auto = true/auto = false/g' "$_cfg"
    warn "Disabled mise [deps] auto=true (stdout spam poisons captures) in $_cfg"
  fi
done
# ~/.profile exported DOCKER_CONFIG=~/newdir/.docker (dir doesn't exist),
# breaking Docker in any sh-family shell. Removed 2026-07-09; sweep regressions.
if [[ -f ~/.profile ]] && grep -q '^export DOCKER_CONFIG=.*newdir' ~/.profile; then
  sed -i '' '/^export DOCKER_CONFIG=.*newdir/d' ~/.profile
  warn "Removed broken DOCKER_CONFIG (nonexistent newdir) from ~/.profile"
fi
if command -v mise &>/dev/null; then
  mise self-update --yes 2>/dev/null || true
  if [[ -d ~/Developer ]]; then
    cd ~/Developer && mise trust --quiet 2>/dev/null || true
    cd ~
  fi
  mise upgrade --yes 2>&1 | grep -vE "DEBUG|up to date" || true
  # `mise prune` can SIGABRT in its own logger on the non-TTY uninstall path
  # (Rust panic in VerboseReport::set_message — reproduced 2026-06-24). Run it
  # tolerantly; if it dies, reclaim the stale-version space by removing exactly
  # the install dirs that --dry-run names. dry-run never enters the crashing
  # delete path, and only lists versions NO config references, so it is both
  # safe and authoritative.
  if ! mise prune --yes >/dev/null 2>&1; then
    warn "mise prune crashed (known logger panic) — removing stale versions by hand"
    mise prune --dry-run 2>/dev/null | awk '/remove .*\/installs\// {print $NF}' | \
      while read -r _p; do
        _p="${_p/#\~/$HOME}"
        [[ -d "$_p" ]] && rm -rf "$_p" && info "  pruned $(basename "$(dirname "$_p")")@$(basename "$_p")"
      done
  fi
  # `|| warn` — a reshim failure here is a plain command under `set -e`: it
  # would silently kill sections 4+ (same failure class as the simctl/gemdir
  # guards). The empty-shims check below already reports the fallout.
  mise reshim || warn "mise reshim failed — shims may be stale"
  # Guard: an EMPTY shims dir means login shells (`mise activate zsh --shims`
  # in .zprofile) get NO mise tools and `gem`/`ruby` fall through to the
  # system Ruby 2.6 → Gem::FilePermissionError on /Library/Ruby/Gems/2.6.0.
  # Reproduced 2026-07-06; reshim regenerates them, so verify it worked.
  _SHIM_N=$(ls "$HOME/.local/share/mise/shims" 2>/dev/null | wc -l | tr -d ' ')
  if [[ "${_SHIM_N:-0}" -eq 0 ]]; then
    warn "mise shims dir is EMPTY after reshim — login shells will use system Ruby"
  fi
  ok "Mise $(mise --version) (${_SHIM_N} shims)"
else
  fail "mise not found"
fi

# ── 4. NPM ────────────────────────────────────────
info "npm update + cache clean..."
npm install -g npm@latest &>/dev/null || true
npm install -g @google/clasp &>/dev/null || true
npm update -g &>/dev/null || true
npm cache clean --force &>/dev/null || true
rm -rf "$HOME/Library/Caches/node-gyp" 2>/dev/null || true
ok "npm $(npm --version) — globals updated, cache cleared"

# ── 4b. GITHUB PACKAGES — refresh tokens ──────────
info "Refreshing GitHub Packages tokens..."
# `|| _GH_TOKEN=""` is load-bearing: `gh auth token` exits non-zero when not
# logged in (and `gh api user` when offline/expired) — an unguarded failing
# assignment under `set -e` would abort the WHOLE script here, before the
# empty-check below could warn. Same bug class as the gemdir/simctl guards.
_GH_TOKEN=$(gh auth token 2>/dev/null) || _GH_TOKEN=""
_GH_USER=$(gh api user --jq '.login' 2>/dev/null) || _GH_USER=""
if [[ -n "$_GH_TOKEN" && -n "$_GH_USER" ]]; then
  # v2.7: the old x-oauth-scopes header check here nagged on EVERY run and
  # could never clear for two reasons found 2026-07-16:
  #   1. Fine-grained org tokens (github_pat_*) have NO classic scopes and
  #      return an EMPTY x-oauth-scopes header — but npm.pkg.github.com only
  #      accepts CLASSIC tokens anyway (GitHub docs: "GitHub Packages only
  #      supports authentication using a personal access token (classic)"),
  #      so a fine-grained token can never fix this. The keyring token itself
  #      must carry the scopes: ONE-TIME interactive fix →
  #      gh auth refresh -s read:packages,write:packages -h github.com
  #   2. The token was never actually written to ~/.npmrc (see grep fix below),
  #      so even a good token wouldn't have cleared the section-10 check.
  # The scope nag now lives at the END of this section as a FUNCTIONAL check
  # (npm whoami against the Packages registry) — it warns only when Packages
  # auth truly fails, and goes quiet the moment it works.

  # ── npm ── ~/.npmrc
  # Match the TOKEN line specifically: plain `grep npm.pkg.github.com` also
  # matched the `@marketingtool:registry=https://npm.pkg.github.com` line, so
  # the sed branch ran, matched nothing, and NO token was ever written —
  # npm fell back to a stale globalconfig token → daily 403s (found 2026-07-16).
  if grep -q "^//npm.pkg.github.com/:_authToken=" ~/.npmrc 2>/dev/null; then
    sed -i '' "s|//npm.pkg.github.com/:_authToken=.*|//npm.pkg.github.com/:_authToken=${_GH_TOKEN}|" ~/.npmrc
  else
    cat >> ~/.npmrc <<NPMEOF

# GitHub Packages — Marketingtool-pro org
@marketingtool-pro:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${_GH_TOKEN}
NPMEOF
  fi
  chmod 600 ~/.npmrc

  # ── Ruby ── ~/.gem/credentials
  mkdir -p ~/.gem && chmod 700 ~/.gem
  cat > ~/.gem/credentials <<GEMEOF
---
:github: Bearer ${_GH_TOKEN}
GEMEOF
  chmod 600 ~/.gem/credentials

  # ── Gradle ── ~/.gradle/gradle.properties (Java/Kotlin via Temurin JAVA_HOME + mise)
  mkdir -p ~/.gradle
  if [[ -f ~/.gradle/gradle.properties ]] && grep -q "^gpr.user=" ~/.gradle/gradle.properties; then
    sed -i '' "s|^gpr.user=.*|gpr.user=${_GH_USER}|" ~/.gradle/gradle.properties
    sed -i '' "s|^gpr.token=.*|gpr.token=${_GH_TOKEN}|" ~/.gradle/gradle.properties
  else
    cat >> ~/.gradle/gradle.properties <<GRADLEEOF

# GitHub Packages — Marketingtool-pro org
gpr.user=${_GH_USER}
gpr.token=${_GH_TOKEN}
GRADLEEOF
  fi
  chmod 600 ~/.gradle/gradle.properties

  # ── Maven ── ~/.m2/settings.xml (used by Gradle Maven plugins + mvnd)
  mkdir -p ~/.m2
  if [[ -f ~/.m2/settings.xml ]] && grep -q "<id>github</id>" ~/.m2/settings.xml; then
    # Update existing github server entry password
    python3 -c "
import re, sys
p = '$HOME/.m2/settings.xml'
s = open(p).read()
s = re.sub(r'(<server>\s*<id>github</id>\s*<username>)[^<]*(</username>\s*<password>)[^<]*(</password>\s*</server>)',
           r'\\g<1>${_GH_USER}\\g<2>${_GH_TOKEN}\\g<3>', s, flags=re.DOTALL)
open(p,'w').write(s)
" 2>/dev/null || warn "Maven settings.xml github block update failed — edit manually"
  else
    cat > ~/.m2/settings.xml <<MAVENEOF
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>github</id>
      <username>${_GH_USER}</username>
      <password>${_GH_TOKEN}</password>
    </server>
  </servers>
</settings>
MAVENEOF
  fi
  chmod 600 ~/.m2/settings.xml

  # ── NuGet ── ~/.nuget/NuGet/NuGet.Config (used by dotnet)
  mkdir -p ~/.nuget/NuGet
  if command -v dotnet &>/dev/null; then
    if dotnet nuget list source | grep -q "github-marketingtool-pro"; then
      dotnet nuget update source "github-marketingtool-pro" --username "${_GH_USER}" --password "${_GH_TOKEN}" --store-password-in-clear-text &>/dev/null
    else
      dotnet nuget add source "https://nuget.pkg.github.com/${GITHUB_ORG}/index.json" --name "github-marketingtool-pro" --username "${_GH_USER}" --password "${_GH_TOKEN}" --store-password-in-clear-text &>/dev/null
    fi
  fi

  # FUNCTIONAL packages check (replaces the header scope check — see top of
  # section). Runs AFTER the ~/.npmrc write so it tests the refreshed token.
  if npm whoami --registry https://npm.pkg.github.com &>/dev/null; then
    ok "GitHub Packages tokens refreshed (npm + Ruby + Gradle + Maven + NuGet) — user: $_GH_USER"
  else
    warn "GitHub Packages npm auth FAILING (403) — keyring token lacks packages scopes; ONE-TIME fix: gh auth refresh -s read:packages,write:packages -h github.com (note: fine-grained org tokens can NOT auth npm Packages — classic scopes required)"
  fi
else
  warn "gh token/user unavailable — GitHub Packages tokens not refreshed"
fi

# ── 5. RUBY / COCOAPODS TOOLCHAIN ─────────────────
# Ruby 4.x breaks CocoaPods (`undefined method 'green' for nil`), so pin 3.3.x.
# rbenv RETIRED 2026-07-09 (had 0 rubies) — mise is the ONLY Ruby manager;
# login shells get it via `mise activate zsh --shims` in ~/.zprofile.
info "Pinning Ruby 3.3 (CocoaPods-safe) in mise..."
_RUBY_PIN="3.3"; _RUBY_VER="3.3.11"
# ~/mise.toml is a LOCAL config covering everything under $HOME — its
# ruby="latest" (4.x) overrode the global 3.3 pin and, with stale shims,
# dropped shells onto system Ruby 2.6 (Gem::FilePermissionError). Fixed
# 2026-07-06; installers re-create it, so re-pin on every run.
if [[ -f ~/mise.toml ]] && grep -q '^ruby = "latest"' ~/mise.toml; then
  sed -i '' 's|^ruby = "latest"|ruby = "3.3"|' ~/mise.toml
  warn '~/mise.toml ruby=latest reappeared — re-pinned to 3.3'
fi
if command -v mise &>/dev/null; then
  mise use -g "ruby@${_RUBY_PIN}" &>/dev/null || warn "mise ruby pin failed"
  # v2.4 fix: `mise current ruby` here answers for $PWD, and ~/mise.toml pins
  # ruby=latest (4.x) — that wrote 4.0.5 into ~/.ruby-version and broke the
  # CocoaPods pin. Probe the ACTUAL 3.3 install instead; never trust cwd.
  _RUBY_VER="$(mise exec "ruby@${_RUBY_PIN}" -- ruby -e 'print RUBY_VERSION' 2>/dev/null || echo "$_RUBY_VER")"
fi
# SANITIZE before writing: keep ONLY a bare X.Y.Z on the last line. Even with
# the [deps] auto=true sweep above, ANY future stdout leak into this capture
# must never corrupt ~/.ruby-version again (that broke every command 2026-07-17).
_RUBY_VER="$(printf '%s\n' "$_RUBY_VER" | grep -oE '^[0-9]+\.[0-9]+(\.[0-9]+)?$' | tail -1)"
[[ -z "$_RUBY_VER" ]] && _RUBY_VER="3.3.11"   # fallback if capture was empty/garbage
echo "$_RUBY_VER" > ~/.ruby-version          # mise reads .ruby-version natively
ok "Ruby pinned → $_RUBY_VER (mise)"

info "Ensuring CocoaPods (mise ruby)..."
if command -v mise &>/dev/null; then
  mise exec "ruby@${_RUBY_PIN}" -- gem list -i cocoapods &>/dev/null \
    || mise exec "ruby@${_RUBY_PIN}" -- gem install cocoapods &>/dev/null \
    || warn "mise CocoaPods install failed (retry: mise exec ruby@${_RUBY_PIN} -- gem install cocoapods)"
  mise reshim &>/dev/null || true
fi
ok "CocoaPods → $(pod --version 2>/dev/null || echo 'not found')"

# ── 5b. RUBY GEMS ─────────────────────────────────
info "Updating Ruby gems..."
# NEVER call bare `gem` here: when mise shims are missing/stale, `gem`
# resolves to the macOS system Ruby 2.6 and dies with
# Gem::FilePermissionError (/Library/Ruby/Gems/2.6.0 is root-owned).
# Route every gem call through the pinned mise ruby explicitly.
if command -v mise &>/dev/null; then
  # `|| _GEMDIR=""` is load-bearing: `gem env gemdir` exits non-zero (and empty)
  # when the mise ruby gem env is broken, and an unguarded command-substitution
  # assignment under `set -e` aborted the WHOLE script HERE — before the empty-
  # check below could handle it. Same bug class as the simctl guard (section 8b).
  # Found 2026-07-08 via `zsh -x` trace (died at line 263, _GEMDIR=empty).
  _GEMDIR=$(mise exec "ruby@${_RUBY_PIN}" -- gem env gemdir 2>/dev/null) || _GEMDIR=""
  if [[ "$_GEMDIR" == /Library/Ruby/* || -z "$_GEMDIR" ]]; then
    warn "gem resolves to system Ruby ($_GEMDIR) — skipping gem update; run: mise reshim"
  else
    run_timeout 120 mise exec "ruby@${_RUBY_PIN}" -- gem update --system &>/dev/null || warn "gem update --system timed out/failed (skipped)"
    run_timeout 180 mise exec "ruby@${_RUBY_PIN}" -- gem update          &>/dev/null || warn "gem update timed out/failed (skipped)"
    mise exec "ruby@${_RUBY_PIN}" -- gem cleanup &>/dev/null || true
    # ok only on the SUCCESS path — this line used to sit after the if/else and
    # printed "Gems updated — Ruby " (blank version) even when the update was
    # SKIPPED via the warn above. Observed 2026-07-09 in a live run.
    ok "Gems updated — Ruby $(mise exec "ruby@${_RUBY_PIN}" -- ruby -e 'print RUBY_VERSION' 2>/dev/null)"
  fi
else
  warn "mise not found — skipped gem update (bare gem would hit system Ruby 2.6)"
fi

# ── 6. GCLOUD ─────────────────────────────────────
info "Updating gcloud..."
# gcloud execs $CLOUDSDK_PYTHON directly; when that interpreter is deleted
# (2026-07-06: .zshrc pointed at the removed python.org 3.13 framework) every
# gcloud call — and everything built on it, like id-clasp-bypass — dies with
# "No such file or directory". Self-heal to the mise python.
# `command -v` (not `-x`) — CLOUDSDK_PYTHON may legitimately be a bare command
# name like `python3` (gcloud resolves it via PATH); `-x python3` looks for a
# file in the CWD and false-alarmed on every run from an older shell session.
if [[ -z "${CLOUDSDK_PYTHON:-}" ]] || ! command -v "${CLOUDSDK_PYTHON}" &>/dev/null; then
  _MISE_PY="$HOME/.local/share/mise/installs/python/3.14/bin/python3"
  [[ -x "$_MISE_PY" ]] || _MISE_PY="$HOME/.local/share/mise/installs/python/3.12/bin/python3"
  if [[ -x "$_MISE_PY" ]]; then
    export CLOUDSDK_PYTHON="$_MISE_PY"
    warn "CLOUDSDK_PYTHON was missing/broken — using $_MISE_PY (fix ~/.zshrc if this repeats)"
  fi
fi
if command -v gcloud &>/dev/null; then
  gcloud components update --quiet 2>/dev/null || true
  ok "$(gcloud --version | head -1)"
else
  fail "gcloud not found"
fi

# ── 6b. CLASP ─────────────────────────────────────
info "Clasp auth bypass..."
# v2.7: ~/Developer/credentials_backup is GONE (verified 2026-07-16) — the
# vault is ~/.secrets/credentials_backup. Try the vault first, legacy second,
# and if the key file is missing but the bypass is ALREADY configured in
# ~/.clasprc.json, that's fine — don't warn about a key we don't need.
_CLASP_KEY="$HOME/.secrets/credentials_backup/marketing-tool-484720-40a8b411afcf.json"
[[ -f "$_CLASP_KEY" ]] || _CLASP_KEY="$HOME/Developer/credentials_backup/marketing-tool-484720-40a8b411afcf.json"
if [[ -f "$_CLASP_KEY" ]]; then
  if ~/.local/bin/id-clasp-bypass "id-clasp-bypas@marketing-tool-484720.iam.gserviceaccount.com" "$_CLASP_KEY" &>/dev/null; then
    ok "Clasp bypass configured (using service account)"
  else
    warn "Clasp bypass configuration failed (invalid key or revoked SA)"
  fi
elif [[ -f ~/.clasprc.json ]] && grep -q "isServiceAccount" ~/.clasprc.json; then
  ok "Clasp bypass already active (~/.clasprc.json) — key file not needed"
else
  warn "Clasp key not found: $_CLASP_KEY"
fi

# ── 7. GH EXTENSIONS ──────────────────────────────
info "Updating gh extensions..."
gh extension upgrade --all 2>/dev/null || true
ok "gh extensions updated"

# ── 7b. AZURE CLI ─────────────────────────────────
info "Updating Azure CLI..."
if command -v az &>/dev/null; then
  az upgrade --yes &>/dev/null || true
  ok "$(az --version | head -1)"
else
  warn "Azure CLI not found"
fi

# ── 7c. FIREBASE CLI ──────────────────────────────
info "Ensuring Firebase CLI..."
if command -v firebase &>/dev/null; then
  ok "Firebase CLI → $(firebase --version 2>/dev/null | tail -1)"
else
  # firebase is normally a mise tool (global config pins it) — a plain
  # `mise install` brings it back; npm-global is the VPS-style fallback.
  mise use -g firebase@latest &>/dev/null \
    || npm install -g firebase-tools@latest &>/dev/null \
    || warn "Firebase CLI install failed"
  ok "Firebase CLI → $(firebase --version 2>/dev/null | tail -1 || echo 'not found')"
fi

# ── 8. JUNK CLEANUP ───────────────────────────────
info "Cleaning junk & caches..."
find ~/Downloads ~/Desktop ~/Developer -name ".DS_Store" -delete 2>/dev/null || true
rm -rf ~/Library/Developer/Xcode/DerivedData 2>/dev/null || true
# Duplicate tool-homes (2026-07-05 clean removed 10+ GB of these; installers
# re-create them). Canonical homes: ~/.local/share/mise, ~/.rustup, ~/.nvm,
# Xcode-beta CLT. Anything at these paths is a regression — sweep it.
for _dup in ~/.mise ~/Developer/.rustup ~/Developer/.nvm ~/Developer/CommandLineTools \
             ~/Developer/.vite-plus; do
  # .vite-plus added 2026-07-09: installer re-created it inside ~/Developer at
  # 09:48 (canonical home is ~/.vite-plus, sourced from .zprofile/.bashrc).
  [[ -d "$_dup" && ! -L "$_dup" ]] && rm -rf "$_dup" && warn "Removed reappeared duplicate: $_dup"
done
[[ -d "$HOME/.gradle/caches" ]] && find "$HOME/.gradle/caches" -name "*.lock" -delete 2>/dev/null || true
# Remove duplicate/junk scripts from home (keep only setup_master.sh + developer_project_scanner.rb)
for f in ~/'MASTER_ZSH_SETUP copy.sh' ~/maintenance_optimized.sh ~/MASTER_ZSH_SETUP.sh ~/sdkman_install.sh ~/install.sh; do
  [[ -f "$f" ]] && rm -f "$f" && warn "Removed junk: $(basename $f)"
done

# Stray repo/package junk at ~/Developer ROOT (left behind by Actions-runner
# experiments on 2026-06-12). A .git here makes every subproject look like a
# remote-less repo; a node_modules here hijacks `require()` resolution (stale
# expo 46 broke `expo config` in the real app). Backup to /tmp, never rm -rf.
if [[ -d ~/Developer/.git ]] && ! git -C ~/Developer rev-parse HEAD &>/dev/null; then
  mv ~/Developer/.git "/tmp/stray-developer-dotgit-$(date +%Y%m%d%H%M%S)"
  warn "Removed stray commitless ~/Developer/.git (backup in /tmp)"
fi
# v2.3: also quarantine stray uv/python scaffolds. A root pyproject.toml makes
# `uv run`/`uv sync` in any subproject-without-its-own-pyproject walk UP and bind
# to an empty "developer" project (wrong venv). Same failure class as stray npm.
# NOTE: .python-version deliberately NOT quarantined — a root version pin may be
# intentional; flag it manually rather than move it on every run.
# Gemfile/Gemfile.lock added 2026-07-10: a stray ~/Developer/Gemfile (jekyll/
# rails/fastlane/cocoapods scaffold) generated Bundler binstubs into
# ~/Developer/bin that — via [env._] path=["./bin"] — shadowed the working mise
# cocoapods `pod` everywhere under ~/Developer and died on `require
# "bundler/setup"` (unbuilt bundle) → the "CocoaPods → not found" you saw.
# go.mod/main.go/vendor/third_party_notices added 2026-07-15: an agent writing
# throwaway Go GitHub-API tools (module "github.com/my/repo", imports cli/cli +
# go-gh) at the ~/Developer cwd left these at root. A root go.mod makes every
# Go subproject-without-its-own-go.mod resolve to it — same hijack class as the
# stray npm/python scaffolds. third_party_notices is its `go mod vendor` output.
for f in package.json package-lock.json node_modules \
         pyproject.toml uv.lock uv.toml .venv \
         Gemfile Gemfile.lock \
         go.mod go.sum main.go vendor third_party_notices; do
  if [[ -e ~/Developer/$f ]]; then
    mkdir -p /tmp/stray-developer-root-backup
    mv ~/Developer/$f "/tmp/stray-developer-root-backup/$f.$(date +%Y%m%d%H%M%S)"
    warn "Moved stray ~/Developer/$f → /tmp/stray-developer-root-backup"
  fi
done
# Sweep Bundler binstubs out of ~/Developer/bin (on PATH via [env._] path=./bin):
# any file that does `require "bundler/setup"` shadows the real mise ruby tool of
# the same name (pod, fastlane, rake, ...) and breaks when the root bundle isn't
# installed. Custom scripts (no bundler/setup) are left untouched. `*(N)` is the
# zsh nullglob qualifier so an empty bin/ can't NOMATCH-abort under `set -e`.
if [[ -d ~/Developer/bin ]]; then
  mkdir -p /tmp/stray-developer-root-backup/bin
  for f in ~/Developer/bin/*(N); do
    if grep -q 'bundler/setup' "$f" 2>/dev/null; then
      mv "$f" "/tmp/stray-developer-root-backup/bin/$(basename "$f").$(date +%Y%m%d%H%M%S)"
      warn "Moved shadowing binstub ~/Developer/bin/$(basename "$f")"
    fi
  done
fi

# Dedup mise activations in ~/.zshrc — the mise installer re-appends
# 'eval "$(...mise activate zsh)"' lines; only the FIRST (canonical, after
# nvm) must survive or the doctor PATH warning comes back.
if (( $(grep -cE '^eval .*mise activate zsh' ~/.zshrc 2>/dev/null) > 1 )); then
  awk '/^eval .*mise activate zsh/ { if (seen++) next } { print }' ~/.zshrc > ~/.zshrc.dedup \
    && mv ~/.zshrc.dedup ~/.zshrc
  warn "Removed duplicate mise activate lines from ~/.zshrc"
fi
ok "Junk cleaned"

# ── 8b. macOS DISK RECLAMATION ────────────────────
# Safe, regenerable space wins verified during the 2026-06-24 deep clean
# (freed ~50 GB). Everything here re-downloads or rebuilds on demand.
info "Reclaiming macOS disk (caches · crash dumps · unused emulator images)..."

# JVM / Android-Studio crash heap dumps — pure junk, often 1 GB+ each.
find ~ ~/Developer ~/Downloads ~/Desktop -maxdepth 2 \
  \( -name "*.hprof" -o -name "hs_err_pid*.log" -o -name "replay_pid*.log" \) \
  -type f -delete 2>/dev/null || true

# Aerial / dynamic wallpaper videos — macOS re-downloads on demand (Store config kept).
rm -rf "$HOME/Library/Application Support/com.apple.wallpaper/aerials" 2>/dev/null || true

# Regenerable JS package-manager caches.
rm -rf "$HOME/.bun/install/cache" 2>/dev/null || true
# mise keeps every downloaded tool tarball forever — 8.3 GB found 2026-07-17.
# Pure cache: mise re-downloads on demand. Installs are NOT touched.
rm -rf "$HOME/.local/share/mise/downloads" 2>/dev/null || true
command -v yarn &>/dev/null && yarn cache clean &>/dev/null || true
command -v pnpm &>/dev/null && pnpm store prune  &>/dev/null || true

# Chrome cache dirs (profile/history/passwords untouched — cache only). v2.4.
find "$HOME/Library/Application Support/Google/Chrome" -type d \
  \( -name "Cache" -o -name "Code Cache" -o -name "GPUCache" -o -name "CacheStorage" \
     -o -name "ScriptCache" -o -name "GrShaderCache" -o -name "ShaderCache" \
     -o -name "component_crx_cache" \) -prune -exec rm -rf {} + 2>/dev/null || true

# iOS simulator runtimes: keep only the NEWEST (each is 17-18 GB; two were
# stacked before the 2026-07-05 clean). Old ones re-download via Xcode if needed.
# `|| _RT_JSON=""` is load-bearing: simctl exits 72 when xcode-select points at
# CommandLineTools (no full Xcode), and an unguarded failing assignment under
# `set -e` killed the whole script HERE, silently (stderr is discarded) —
# everything after section 8b never ran. Found 2026-07-08.
_RT_JSON=$(xcrun simctl runtime list -j 2>/dev/null) || _RT_JSON=""
if [[ -n "$_RT_JSON" ]]; then
  print -r -- "$_RT_JSON" | python3 -c '
import json, sys, subprocess
d = json.load(sys.stdin)
ios = [(v.get("version",""), k) for k, v in d.items()
       if "iOS" in v.get("runtimeIdentifier","") and v.get("state") == "Ready"]
ios.sort(key=lambda t: tuple(int(x) for x in t[0].split(".") if x.isdigit()))
for ver, key in ios[:-1]:
    subprocess.run(["xcrun", "simctl", "runtime", "delete", key], capture_output=True)
    print(f"Removed old iOS runtime {ver}")
' 2>/dev/null | while read -r _l; do warn "$_l"; done
fi

# Unused Android emulator system-images: drop any API level that NO existing AVD
# references. Build targets use sdk/platforms/, not system-images/, so this frees
# only emulator images (re-installable via sdkmanager). Conservative: requires an
# AVD to exist AND a parsed used-API set, and never deletes a referenced level.
# `find` (not zsh glob qualifiers) gathers paths — a `*.avd(N)` glob raised
# NOMATCH under `set -e` in this zsh, which would abort the whole script.
_SYSIMG="$HOME/Library/Android/sdk/system-images"
_avd_cfgs=( ${(f)"$(find "$HOME/.android/avd" -maxdepth 2 -name config.ini 2>/dev/null || true)"} )
if [[ -d "$_SYSIMG" && ${#_avd_cfgs} -gt 0 ]]; then
  _USED_APIS=$(grep -hoE 'system-images/[^/]+' "${_avd_cfgs[@]}" 2>/dev/null \
                 | sed 's|system-images/||' | sort -u)
  if [[ -n "$_USED_APIS" ]]; then
    for _api_dir in ${(f)"$(find "$_SYSIMG" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)"}; do
      _api=${_api_dir##*/}
      if ! print -r -- "$_USED_APIS" | grep -qx "$_api"; then
        _sz=$(du -sh "$_api_dir" 2>/dev/null | awk '{print $1}')
        rm -rf "$_api_dir" && warn "Removed unused Android image: $_api ($_sz)"
      fi
    done
  fi
fi
ok "macOS disk reclaimed"

# ── 9. DEVELOPER PROJECT SCAN ─────────────────────
info "Developer project scan..."
# Scanner path history: developer_project_scanner.rb → Developer.rb → now
# "Ai marketingtool llc.rb" in the org repo (~/Developer/Developer.rb verified
# GONE 2026-07-16 — this section had gone back to warning/skipping every run).
# Try the legacy path first, then the repo copy; report what actually happened.
_SCANNER=""
for _cand in ~/Developer/Developer.rb "$HOME/ai-marketingtool-llc/Ai marketingtool llc.rb"; do
  [[ -f "$_cand" ]] && _SCANNER="$_cand" && break
done
if [[ -n "$_SCANNER" ]]; then
  if ruby "$_SCANNER"; then
    ok "Project scan done ($_SCANNER)"
  else
    warn "Project scan exited with errors (see output above)"
  fi
else
  warn "Scanner NOT FOUND (Developer.rb / Ai marketingtool llc.rb) — project scan skipped"
fi

# ── 10. ACCOUNT STATUS ────────────────────────────
echo ""; hr; echo "  ACCOUNTS"; hr

# GitHub
if gh auth status &>/dev/null; then
  ok "GitHub → $(gh api user --jq '.login' 2>/dev/null) | org: Marketingtool-pro"
else
  warn "GitHub not logged in → gh auth login"
  # only prompt on a real terminal — an unattended run would hang here forever
  [[ -t 0 ]] && gh auth login
fi

# GCP
if gcloud auth list 2>/dev/null | grep -q "ACTIVE"; then
  ok "GCP → $(gcloud config get-value account 2>/dev/null)"
else
  warn "GCP not logged in"; [[ -t 0 ]] && gcloud auth login
fi

# Firebase
# Guarded: if the firebase CLI is missing (section 7c install failed) this is
# exit 127 → unguarded assignment under `set -e` kills the rest of the script.
FBLIST=$(firebase login:list 2>/dev/null) || FBLIST=""
if echo "$FBLIST" | grep -q "@"; then
  # More strict email regex to avoid picking up paths
  _FB_EMAIL=$(echo "$FBLIST" | grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | grep -v "/" | head -1)
  ok "Firebase → ${_FB_EMAIL:-"Logged In"}"
else
  warn "Firebase not logged in"; [[ -t 0 ]] && firebase login
fi

# Clasp
if [[ -f ~/.clasprc.json ]] && grep -q "isServiceAccount" ~/.clasprc.json; then
  _CLASP_EMAIL=$(grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' ~/.clasprc.json | head -1)
  ok "Clasp → $_CLASP_EMAIL (Bypass Active)"
else
  warn "Clasp bypass not configured"
fi

# npm
if npm whoami &>/dev/null 2>&1; then
  ok "npm → $(npm whoami)"
else
  warn "npm token expired — run: npm login"
fi

# GitBook (CLI runs via bunx/npx — not installed globally; auth lives in the
# config file below, added 2026-07-06 as "Marketingtool Pro")
_GB_CFG="$HOME/Library/Preferences/gitbook-nodejs/config.json"
if [[ -f "$_GB_CFG" ]] && grep -q '"token"' "$_GB_CFG"; then
  chmod 600 "$_GB_CFG" 2>/dev/null || true   # token file — keep it private
  ok "GitBook → authenticated (api.gitbook.com)"
else
  warn "GitBook not authenticated — run: bunx @gitbook/cli auth"
fi

# GitHub Packages
# Guarded: `npm whoami` exits 1 whenever the registry token is missing/expired
# — the common case this check exists FOR. Unguarded, `set -e` aborted here and
# the "not authenticated" warn below was unreachable.
_GH_PKG_USER=$(npm whoami --registry https://npm.pkg.github.com 2>/dev/null) || _GH_PKG_USER=""
if [[ -n "$_GH_PKG_USER" ]]; then
  ok "GitHub Packages npm → @marketingtool-pro ($_GH_PKG_USER)"
else
  warn "GitHub Packages npm not authenticated"
fi

# Ruby GitHub Packages
if [[ -f ~/.gem/credentials ]] && grep -q "github:" ~/.gem/credentials 2>/dev/null; then
  ok "GitHub Packages Ruby → ~/.gem/credentials set"
else
  warn "Ruby GitHub Packages credentials missing"
fi

# Gradle GitHub Packages
if [[ -f ~/.gradle/gradle.properties ]] && grep -q "^gpr.token=" ~/.gradle/gradle.properties 2>/dev/null; then
  ok "GitHub Packages Gradle → ~/.gradle/gradle.properties set (user: $(grep '^gpr.user=' ~/.gradle/gradle.properties | cut -d= -f2))"
else
  warn "Gradle GitHub Packages credentials missing"
fi

# Maven GitHub Packages
if [[ -f ~/.m2/settings.xml ]] && grep -q "<id>github</id>" ~/.m2/settings.xml 2>/dev/null; then
  ok "GitHub Packages Maven → ~/.m2/settings.xml set"
else
  warn "Maven GitHub Packages credentials missing"
fi

# NuGet GitHub Packages
if command -v dotnet &>/dev/null && dotnet nuget list source | grep -q "github-marketingtool-pro"; then
  ok "GitHub Packages NuGet → github-marketingtool-pro source active"
else
  warn "NuGet GitHub Packages source missing"
fi

# Azure
if command -v az &>/dev/null && az account show &>/dev/null; then
  _AZ_USER=$(az account show --query 'user.name' -o tsv)
  _AZ_SUBSCRIPTION=$(az account show --query 'name' -o tsv)
  _AZ_TENANT="Ai marketingtool llc" # Hardcoded as per user confirmation
  ok "Azure → $_AZ_USER | Tenant: $_AZ_TENANT | Sub: $_AZ_SUBSCRIPTION"
else
  warn "Azure not logged in → az login"
fi

# ── 11. VPS UPDATE ────────────────────────────────
echo ""; hr; echo "  VPS UPDATE"; hr

VPS_SERVERS=("root@31.220.107.19:VPS1" "root@62.72.58.221:VPS2")
VPS_UPDATE_CMD='
export PATH="$PATH:/usr/local/bin:/usr/bin"
echo "── update start ──"
# Distro-agnostic: apt (Debian/Ubuntu) OR dnf/yum (RHEL/Fedora/Alma/Rocky).
# Ubuntu hits the apt branch exactly as before.
if command -v apt-get >/dev/null 2>&1; then
  apt-get update -qq && apt-get upgrade -y -qq 2>&1 | tail -3
  apt-get autoremove -y -qq 2>&1 | tail -1; apt-get clean -qq
elif command -v dnf >/dev/null 2>&1; then
  dnf upgrade -y -q 2>&1 | tail -3
  dnf autoremove -y -q 2>&1 | tail -1; dnf clean all -q >/dev/null 2>&1 || true
elif command -v yum >/dev/null 2>&1; then
  yum update -y -q 2>&1 | tail -3
  yum autoremove -y -q 2>&1 | tail -1; yum clean all -q >/dev/null 2>&1 || true
else
  echo "no supported package manager (apt/dnf/yum) found"
fi
npm install -g firebase-tools@latest 2>&1 | tail -1
gem update --system 2>/dev/null | tail -1 || true
if [[ -f /root/google-cloud-sdk/bin/gcloud ]]; then
  /root/google-cloud-sdk/bin/gcloud components update --quiet 2>/dev/null | tail -2 || true
fi
find /root /var/www -name ".DS_Store" -delete 2>/dev/null || true
echo "── update done ──"
node -v 2>/dev/null || echo "node: not found"
firebase --version 2>/dev/null || echo "firebase: not found"
gh --version 2>/dev/null | head -1 || echo "gh: not found"
'

for ENTRY in "${VPS_SERVERS[@]}"; do
  USER_HOST="${ENTRY%%:*}"
  LABEL="${ENTRY##*:}"
  IP="${USER_HOST##*@}"
  info "$LABEL ($IP) — connecting..."

  # Copy SSH key if needed
  # accept-new (not =no): trusts a host on FIRST contact but REFUSES a changed
  # key afterwards — =no silently accepted key changes, i.e. no MITM protection.
  if ! ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=accept-new "$USER_HOST" "exit" 2>/dev/null; then
    warn "$LABEL — SSH key missing, please run: ssh-copy-id $USER_HOST"
    continue
  fi

  ssh -o StrictHostKeyChecking=accept-new "$USER_HOST" "$VPS_UPDATE_CMD" 2>&1 | \
    grep -vE "^$|WARNING|debconf|update-initramfs" | sed "s/^/  [$LABEL] /"
  ok "$LABEL updated ✓"
done

# ── 12. SUMMARY ───────────────────────────────────
echo ""; hr; echo "  VERSIONS"; hr
printf "%-12s %s\n" "mise:"     "$(mise --version 2>/dev/null)"
printf "%-12s %s\n" "node:"     "$(node -v 2>/dev/null)"
printf "%-12s %s\n" "ruby:"     "$(ruby -v 2>/dev/null | awk '{print $1,$2}')"
printf "%-12s %s\n" "python:"   "$(python3 --version 2>/dev/null)"
printf "%-12s %s\n" "dotnet:"   "$(dotnet --version 2>/dev/null)"
printf "%-12s %s\n" "go:"       "$(go version 2>/dev/null | awk '{print $3}')"
printf "%-12s %s\n" "bun:"      "$(bun --version 2>/dev/null)"
printf "%-12s %s\n" "firebase:" "$(firebase --version 2>/dev/null)"
printf "%-12s %s\n" "clasp:"    "$(clasp --version 2>/dev/null)"
printf "%-12s %s\n" "gcloud:"   "$(gcloud --version 2>/dev/null | head -1)"
printf "%-12s %s\n" "az:"       "$(az --version 2>/dev/null | head -1 | awk '{print $2}')"
printf "%-12s %s\n" "gh:"       "$(gh --version 2>/dev/null | head -1)"
echo ""; hr
ok "ALL DONE — Marketingtool-pro"
hr; echo ""
