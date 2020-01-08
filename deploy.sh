#!/bin/bash
set -eu

sls deploy

./scripts/deploy_static_files.sh