#!/bin/bash
set -eu

sls deploy

./scripts/build_frontend_config.sh ./frontend/src/config.js

#./scripts/deploy_static_files.sh