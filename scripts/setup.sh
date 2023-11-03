#!/bin/bash

# Solana RWA Portal Setup Script
# This script sets up the development environment for the RWA Portal

set -e

echo "🚀 Setting up Solana RWA Portal..."

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
check_command "node"
check_command "yarn"
check_command "rustc"
check_command "solana"
check_command "anchor"

echo "✅ All prerequisites are installed"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build Anchor program
echo "🔨 Building Anchor program..."
yarn anchor:build

# Set up Solana configuration
echo "⚙️  Setting up Solana configuration..."
solana config set --url localhost

# Check if keypair exists, create if not
if [ ! -f ~/.config/solana/id.json ]; then
    echo "🔑 Creating Solana keypair..."
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start Solana test validator: solana-test-validator --reset"
echo "2. Deploy the program: yarn anchor:deploy"
echo "3. Start the frontend: yarn dev"
echo ""
echo "🌐 The application will be available at http://localhost:3000"
