#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install --disable-pip-version-check -r backend/requirements.txt
(cd frontend && npm install)
echo
echo "Telepítés kész. Indítás: ./start.sh"
