#!/usr/bin/env bash
# Starts the dev server in the background and exits 0 once it responds.
# Writes the PID to .dev-server.pid so callers can clean up.

set -euo pipefail

PORT="${PORT:-5173}"
URL="http://localhost:${PORT}"
TIMEOUT="${DEV_READY_TIMEOUT:-60}"
PID_FILE=".dev-server.pid"
LOG_FILE=".dev-server.log"

if curl -sf -o /dev/null --max-time 2 "$URL"; then
  echo "dev server already responding at $URL"
  exit 0
fi

[ -f "$PID_FILE" ] && rm -f "$PID_FILE"

echo "starting dev server on $URL..."
nohup pnpm dev > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

elapsed=0
until curl -sf -o /dev/null --max-time 2 "$URL"; do
  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo "dev server did not respond within ${TIMEOUT}s"
    echo "--- last 40 lines of $LOG_FILE ---"
    tail -n 40 "$LOG_FILE" || true
    if [ -f "$PID_FILE" ]; then
      kill "$(cat "$PID_FILE")" 2>/dev/null || true
      rm -f "$PID_FILE"
    fi
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "dev server ready at $URL (pid $(cat $PID_FILE))"
