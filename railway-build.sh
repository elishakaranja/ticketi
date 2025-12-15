#!/usr/bin/env bash
# Build script for Ticketi backend on Railway

set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r server/requirements.txt

# Navigate to server directory
cd server

# Run database migrations
flask db upgrade

# Optional: Seed database (uncomment after first deploy if needed)
# python seed_kenya_events.py
