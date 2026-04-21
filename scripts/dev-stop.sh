#!/usr/bin/env bash
set -euo pipefail
PID_FILE=".dev-server.pid"
if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo "stopped dev server (pid $PID)"
  fi
  rm -f "$PID_FILE"
else
  echo "no dev server pid file found"
fi
