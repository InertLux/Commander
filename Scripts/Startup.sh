#!/bin/bash

TARGET_URL="http://localhost:5000"
PROCESS_TAG="qute-dev-server"
QUTE_SOCKET="/tmp/qutebrowser-ipc-$(whoami)"

echo "Looking for socket at: $QUTE_SOCKET"
echo "Socket exists: [ -S $QUTE_SOCKET ] = $( [ -S "$QUTE_SOCKET" ] && echo "YES" || echo "NO" )"

# Cleanup function on exit
cleanup() {
  echo "Cleaning up..."
  kill $WATCH_PID 2>/dev/null
  kill $QUTE_PID 2>/dev/null
  rm -f /tmp/${PROCESS_TAG}.pid
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for server
echo "Waiting for server to be ready at $TARGET_URL..."
for i in {1..30}; do
  if curl -s "$TARGET_URL" > /dev/null 2>&1; then
    echo "✓ Server is ready!"
    break
  fi
  echo "Still waiting... ($i/30)"
  sleep 1
done

if ! curl -s "$TARGET_URL" > /dev/null 2>&1; then
  echo "✗ Server failed to start"
  exit 1
fi

# Launch with desktop-file-name to match KDE window rule
qutebrowser --desktop-file-name qutebrowser-secondary --target window "$TARGET_URL" &
QUTE_PID=$!
echo "$QUTE_PID" > /tmp/${PROCESS_TAG}.pid

echo "✓ Launched qutebrowser (PID: $QUTE_PID)"

# Wait for qutebrowser socket to be available
echo "Waiting for qutebrowser socket..."
for i in {1..10}; do
  if [ -S "$QUTE_SOCKET" ]; then
    echo "✓ qutebrowser socket ready"
    break
  fi
  sleep 0.5
done

# Watch for file changes and reload browser
echo "Watching for file changes..."
nodemon \
  --watch src \
  --watch public \
  --ext "js,jsx,ts,tsx,html,css,json" \
  --delay 300ms \
  --exitcrash false \
  --exec "./Scripts/ReloadQute.sh" \
  &
WATCH_PID=$!


echo "✓ File watcher started"
echo ""
echo "Dev server running at $TARGET_URL"
echo "Press Ctrl+C to stop"

# Wait for processes
wait $QUTE_PID
cleanup
