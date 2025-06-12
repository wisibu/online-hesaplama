#!/bin/bash

# Exit on error
set -e

echo "🔄 Starting GitHub update process..."

# Check if there are any changes
if git diff --quiet && git diff --cached --quiet; then
    echo "📝 No changes to commit"
    exit 0
fi

# Add all changes
echo "📥 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update: $(date +'%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ GitHub update completed successfully!"

rm -rf .next 