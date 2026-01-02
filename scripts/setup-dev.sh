#!/bin/bash
# Local development environment setup script

set -e

echo "🎨 Setting up $ART development environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm"; exit 1; }

# Install dependencies
echo "\n📦 Installing dependencies..."
pnpm install

# Build shared packages
echo "\n🔨 Building shared packages..."
pnpm --filter @art/shared build

# Copy environment files
echo "\n⚙️  Setting up environment files..."
[ ! -f contracts/.env ] && cp contracts/.env.example contracts/.env && echo "Created contracts/.env"
[ ! -f apps/web/.env.local ] && cp apps/web/.env.example apps/web/.env.local && echo "Created apps/web/.env.local"
[ ! -f packages/indexer/.env ] && cp packages/indexer/.env.example packages/indexer/.env && echo "Created packages/indexer/.env"

# Compile contracts
echo "\n📜 Compiling smart contracts..."
cd contracts && pnpm compile && cd ..

echo "\n✅ Development environment setup complete!"
echo "\nNext steps:"
echo "  1. Update .env files with your configuration"
echo "  2. Start local blockchain: cd contracts && npx hardhat node"
echo "  3. Deploy contracts: cd contracts && pnpm deploy:localhost"
echo "  4. Start web app: cd apps/web && pnpm dev"
echo "  5. Start indexer: cd packages/indexer && pnpm dev"
