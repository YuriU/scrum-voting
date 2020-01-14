#!/bin/bash
set -eu

DESTINATION="${1:-text.txt}"

STAGE="${2:-dev}"

HTTP_ENDPOINT=$(aws \
    cloudformation describe-stacks \
    --stack-name "scrum-vote-${STAGE}" \
    --query "Stacks[0].Outputs[?OutputKey=='HttpEndpoint'] | [0].OutputValue" \
    --output text)

WS_ENDPOINT=$(aws \
    cloudformation describe-stacks \
    --stack-name "scrum-vote-${STAGE}" \
    --query "Stacks[0].Outputs[?OutputKey=='WebSocketEndpoint'] | [0].OutputValue" \
    --output text)

echo ${HTTP_ENDPOINT}
echo ${WS_ENDPOINT}

echo "const Config = {
    BackendHttpEndpoint: \"${HTTP_ENDPOINT}\",
    BackendWebSocketEndpoint: \"${WS_ENDPOINT}\"
}

export default Config;" > ${DESTINATION}