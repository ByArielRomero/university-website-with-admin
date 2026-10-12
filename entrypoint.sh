#!/bin/sh
set -e

mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true
chmod -R 777 /app/public/uploads 2>/dev/null || true

exec su-exec nextjs "$@"
