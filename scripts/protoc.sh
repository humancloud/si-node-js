#!/usr/bin/env bash
#
#
# Copyrights to StackInsights
# All rights are reserved 2019
#
#

ROOT_DIR=$(cd "$(dirname "$0")"/..; pwd)
OUT_DIR="$ROOT_DIR"/${OUT_DIR:-src/proto/}

mkdir -p $OUT_DIR || true

cd "${ROOT_DIR}"/protocol || exit

PROTOC_GEN_TS_PATH="${ROOT_DIR}/node_modules/.bin/protoc-gen-ts"
PROTOC="${ROOT_DIR}/node_modules/.bin/grpc_tools_node_protoc"

${PROTOC} \
    --js_out=import_style=commonjs,binary:$OUT_DIR \
    --grpc_out=grpc_js:$OUT_DIR \
      **/*.proto

${PROTOC} \
    --plugin=protoc-gen-ts="${PROTOC_GEN_TS_PATH}" \
    --ts_out=grpc_js:$OUT_DIR \
      **/*.proto

