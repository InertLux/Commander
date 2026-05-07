#!/bin/bash

# Find qutebrowser IPC socket dynamically
QUTE_SOCKET=$(find /run/user/$(id -u)/qutebrowser -name "ipc-*" 2>/dev/null | head -1)

if [ -z "$QUTE_SOCKET" ]; then
  # Fallback: try older path location
  QUTE_SOCKET=$(find /tmp -name "qutebrowser-ipc-*" 2>/dev/null | head -1)
fi

if [ -n "$QUTE_SOCKET" ] && [ -S "$QUTE_SOCKET" ]; then
  # Send JSON-formatted reload command with proper protocol format
  echo '{"args": [":reload"], "target_arg": null, "protocol_version": 1}' | socat - UNIX-CONNECT:"${QUTE_SOCKET}" 2>/dev/null
  echo "✓ Reloaded qutebrowser"
  exit 0
else
  echo "⚠ qutebrowser IPC socket not found"
  exit 0
fi
