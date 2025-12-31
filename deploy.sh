#!/bin/bash

# LinkHub Deployment Helper Script
# This script helps prepare the project for Vercel deployment

set -e

echo "🚀 LinkHub Deployment Preparation Script"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run: git init"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Current branch: $CURRENT_BRANCH"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Prepare for Vercel deployment"
    echo "✅ Changes committed"
fi

# Verify build works
echo ""
echo "🔨 Running production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Verify dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not created. Build failed."
    exit 1
fi

echo ""
echo "✅ Project is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin $CURRENT_BRANCH"
echo ""
echo "2. Go to Vercel: https://vercel.com/new"
echo "3. Import your repository"
echo "4. Click Deploy"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "⚡ For quick deployment, see QUICK-DEPLOY.md"
