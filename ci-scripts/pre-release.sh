#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

./go version:bump
git status
pnpm publish

git push --all
git push --tags
