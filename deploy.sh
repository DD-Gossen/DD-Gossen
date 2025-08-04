#!/bin/bash

echo "🚀 DD-Gossen Blog Deployment Script"
echo "=================================="

# Build the blog
echo "📝 Building blog from markdown files..."
cd blog
node build.js
cd ..

# Add all changes
echo "📦 Adding changes to git..."
git add .

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S') - Blog updates"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push

echo "✅ Deployment complete!"
echo "🌐 Live site: https://dd-gossen.com/blog/" 