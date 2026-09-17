#!/usr/bin/env bash
# Build the static export and publish it to the gh-pages branch.
#
# GitHub Actions is unavailable on this account (billing lock), so the
# workflow in .github/workflows/deploy.yml cannot run. This script does the
# same job from a local machine.
set -euo pipefail

REPO="https://github.com/winterzxzz/flutter-flow-docs.git"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
npm run build
touch out/.nojekyll

cp -R out/. "$WORK/"
cd "$WORK"
git init -b gh-pages -q
git config user.name "winterzxzz"
git config user.email "athenna.2k3@gmail.com"
git add -A
git commit -q -m "deploy: static export of docs site"
git push -q --force "$REPO" gh-pages

# A legacy Pages build is not triggered automatically by this push.
gh api -X POST repos/winterzxzz/flutter-flow-docs/pages/builds >/dev/null
echo "pushed gh-pages and requested a Pages build"
echo "https://winterzxzz.github.io/flutter-flow-docs/"
