#!/usr/bin/env bash
# Stop local dev processes (O36).
pkill -f "vite" 2>/dev/null || true
pkill -f "vercel dev" 2>/dev/null || true
echo "stopped"
