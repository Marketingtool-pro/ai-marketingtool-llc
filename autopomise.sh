#!/bin/bash
# ==============================================================================
# Autopomise — Workspace Optimization for ~/Developer
# Real cleanup. No Homebrew. Safe by default:
#   (no flags)  DRY-RUN  — scans and reports what WOULD be freed, deletes nothing
#   --apply              — actually delete duplicate/junk dirs + stray installers
#   --deep               — also remove node_modules (forces a later reinstall)
# Detection is DYNAMIC — nothing is hardcoded to paths that may no longer exist.
# Never touches: actions-runner (live CI), .git, real project source.
# ==============================================================================
set -uo pipefail

DEV_ROOT="${DEV_ROOT:-/Users/loken/Developer}"
PHONE_REPO="$DEV_ROOT/AiMarketingtool-pro-fbaf2fad"

APPLY=0; DEEP=0
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --deep)  DEEP=1 ;;
    -h|--help) echo "Usage: $0 [--apply] [--deep]"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

freed_kb=0
human() { du -sh "$1" 2>/dev/null | awk '{print $1}'; }
kb()    { du -sk "$1" 2>/dev/null | awk '{print $1}'; }

# act <path> <description> — remove on --apply, otherwise preview; tally size.
act() {
  local p="$1" desc="$2"
  [ -e "$p" ] || return 0
  local sz size_kb
  sz="$(human "$p")"; size_kb="$(kb "$p")"
  freed_kb=$(( freed_kb + ${size_kb:-0} ))
  if [ "$APPLY" -eq 1 ]; then
    rm -rf "$p" && echo "  ✅ removed   $desc ($sz)  → $p"
  else
    echo "  • would free $desc ($sz)  → $p"
  fi
}

echo "── Autopomise — $DEV_ROOT ──"
if [ "$APPLY" -eq 1 ]; then echo "MODE: APPLY (deleting)"; else echo "MODE: DRY-RUN (preview only — pass --apply to delete)"; fi
[ -d "$DEV_ROOT" ] || { echo "❌ $DEV_ROOT not found"; exit 1; }

# 1. Duplicate / junk directories at the Developer root (dynamic match).
echo "[1/5] Duplicate & junk directories…"
while IFS= read -r -d '' d; do
  act "$d" "duplicate/junk dir"
done < <(find "$DEV_ROOT" -maxdepth 1 -type d \( -name "* copy" -o -name "*copy" -o -name "New Folder*" -o -name "untitled folder*" \) -print0 2>/dev/null)

# 2. OS junk files everywhere (always safe to remove).
echo "[2/5] OS junk files (.DS_Store, Thumbs.db, __MACOSX)…"
junk_n=$(find "$DEV_ROOT" -type f \( -name .DS_Store -o -name Thumbs.db \) 2>/dev/null | wc -l | tr -d ' ')
# __MACOSX dirs were deleted on --apply but never counted/previewed — dry-run
# under-reported what apply would actually remove.
macosx_n=$(find "$DEV_ROOT" -type d -name __MACOSX 2>/dev/null | wc -l | tr -d ' ')
if [ "$APPLY" -eq 1 ]; then
  find "$DEV_ROOT" -type f \( -name .DS_Store -o -name Thumbs.db \) -delete 2>/dev/null
  find "$DEV_ROOT" -type d -name __MACOSX -exec rm -rf {} + 2>/dev/null
  echo "  ✅ removed $junk_n OS junk files + $macosx_n __MACOSX dirs"
else
  echo "  • would remove $junk_n OS junk files + $macosx_n __MACOSX dirs"
fi

# 3. Stray installer downloads in the phone repo (regenerable; not source).
#    NOTE: deliberately does NOT match *.ipa — those are build artifacts
#    (e.g. application-a638ff54-*.ipa is the last-good iOS build, keep it).
#    Only specific runner/Gradle installer archives are targeted.
echo "[3/5] Stray installer binaries in phone repo…"
if [ -d "$PHONE_REPO" ]; then
  while IFS= read -r -d '' f; do
    act "$f" "stray installer binary"
  done < <(find "$PHONE_REPO" -maxdepth 1 -type f \( -name "actions-runner-*.tar.gz" -o -name "develocityctl.jar" -o -name "build-cache-*.jar" \) -print0 2>/dev/null)
else
  echo "  • phone repo not found — skipped"
fi

# 4. Heavy regenerable caches — node_modules only with --deep.
echo "[4/5] Heavy regenerable caches…"
if [ -d "$PHONE_REPO/node_modules" ]; then
  if [ "$DEEP" -eq 1 ]; then
    act "$PHONE_REPO/node_modules" "node_modules (reinstall: bun install)"
  else
    echo "  • skipped node_modules ($(human "$PHONE_REPO/node_modules")) — pass --deep to remove (needs reinstall)"
  fi
fi

# 5. Stray polyglot scaffold junk at the Developer ROOT — some agent/tool keeps
#    dumping project scaffolding there (observed 2026-07-09 09:02: grammar.js,
#    tree-sitter files, build.zig, go.mod, Cargo.toml, node_modules, ...).
#    QUARANTINE (mv to /tmp), never delete — same policy as setup_master.sh.
#    Only exact-name matches at the top level; legit workspace files
#    (Gemfile, mise.toml, .mcp.json, scripts, myports.txt, ...) are untouched.
echo "[5/5] Stray scaffold junk at Developer root…"
SCAFFOLD_JUNK=(
  package.json package-lock.json node_modules yarn.lock pnpm-lock.yaml
  pyproject.toml setup.py uv.lock uv.toml .venv
  go.mod go.sum Cargo.toml Cargo.lock CMakeLists.txt Package.swift pom.xml
  build.zig build.zig.zon grammar.js tree-sitter.json binding.gyp bindings
  composer.json composer.lock composer-setup.php tsconfig.json
  build dist out target .jupyter_ystore.db
)
_QDIR="/tmp/stray-developer-root-backup"
_qn=0
for j in "${SCAFFOLD_JUNK[@]}"; do
  p="$DEV_ROOT/$j"
  [ -e "$p" ] || continue
  if [ "$APPLY" -eq 1 ]; then
    mkdir -p "$_QDIR"
    mv "$p" "$_QDIR/$j.$(date +%Y%m%d%H%M%S)" && echo "  ✅ quarantined $j → $_QDIR"
  else
    echo "  • would quarantine $j → $_QDIR"
  fi
  _qn=$((_qn+1))
done
[ "$_qn" -eq 0 ] && echo "  • none found"

# Summary.
freed_gb=$(awk "BEGIN{printf \"%.2f\", ${freed_kb:-0}/1048576}")
echo "──────────────────────────────────────────────"
if [ "$APPLY" -eq 1 ]; then
  echo "✅ Freed ~${freed_gb} GB"
else
  echo "ℹ️  ~${freed_gb} GB reclaimable — re-run with --apply to delete the items above."
fi

# Runner status (report only — never auto-modifies CI).
# The LIVE runner is at ~/actions-runner (launchd service
# actions.runner.Marketingtool-pro-AiMarketingtool-pro-fbaf2fad.Loken-Mac,
# verified 2026-07-06). The actions-runner dir inside the phone repo holds
# only a leftover _work dir — it is NOT an install; never suggest registering
# it while a configured runner exists.
CONFIGURED_RUNNER=""
for RUNNER_DIR in "$HOME/actions-runner" "$DEV_ROOT/actions-runner" "$PHONE_REPO/actions-runner"; do
  [ -d "$RUNNER_DIR" ] || continue
  if [ -f "$RUNNER_DIR/.runner" ]; then
    CONFIGURED_RUNNER="$RUNNER_DIR"
    if launchctl list 2>/dev/null | grep -q "actions.runner"; then
      echo "GitHub runner: LIVE at $RUNNER_DIR (service running — left untouched)"
    else
      echo "GitHub runner: configured at $RUNNER_DIR but service NOT running — start with:"
      echo "  cd $RUNNER_DIR && ./svc.sh start"
    fi
  fi
done
if [ -z "$CONFIGURED_RUNNER" ]; then
  echo "GitHub runner: NO configured runner found — register with:"
  echo "  cd \$HOME/actions-runner && ./config.sh --url https://github.com/Marketingtool-pro/AiMarketingtool-pro-fbaf2fad --token <RUNNER_TOKEN>"
fi
echo "── Autopomise complete ──"
