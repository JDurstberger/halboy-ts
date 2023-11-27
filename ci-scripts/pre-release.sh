#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

rake version:bump[pre]
rake release

git push --all
git push --tags
