#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate navigation data
echo "🔍 Generating navigation data..."
node scripts/generate-nav-data.mjs

# Build the application
echo "🏗️ Building the application..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
rm -rf deployment_package
mkdir -p deployment_package
cp -r .next deployment_package/
cp -r public deployment_package/
cp -r src deployment_package/
cp package.json deployment_package/
cp next.config.mjs deployment_package/
cp tsconfig.json deployment_package/

echo "✅ Deployment package created successfully!"
echo "📦 Package location: deployment_package/"
echo "🚀 Ready for deployment!" 