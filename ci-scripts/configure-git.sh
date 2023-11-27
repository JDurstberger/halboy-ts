#!/usr/bin/env bash

[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

git config --global user.email "github-actions@durstberger.me"
git config --global user.name "GitHub Actions"
