#!/usr/bin/env bash
cd "$(dirname "$0")"
(cd backend && exec .venv/bin/python -m uvicorn main:app --reload) &
BACKEND_PID=$!
trap 'kill $BACKEND_PID' EXIT

# Megvarja, amig a backend valaszol, csak utana indul a frontend
echo "Varakozas a backendre..."
for i in $(seq 60); do
  curl -s --noproxy '*' -o /dev/null http://127.0.0.1:8000/api/health && break
  sleep 1
done

echo "Backend (API dokumentáció): http://127.0.0.1:8000/docs"
cd frontend && npm run dev -- --open
