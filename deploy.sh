#!/bin/bash
set -eu

sls deploy

chmod +X ./scripts/build_frontend_config.sh
./scripts/build_frontend_config.sh ./frontend/src/config.js

#./scripts/deploy_static_files.sh