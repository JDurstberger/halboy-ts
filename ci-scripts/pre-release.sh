#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

./go version:bump[pre]
./go release

git push --all
git push --tags
