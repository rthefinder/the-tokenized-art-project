#!/bin/bash
# Quick Start Guide for The Tokenized Art Project

cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     $ART — The Tokenized Art Project                         ║
║     A Complete GitHub Repository                             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🎨 Welcome to The Tokenized Art Project!

This is a complete, production-ready blockchain project for 
tokenizing artwork with artist-first principles.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT'S INCLUDED:

✅ Smart Contracts
   • ArtNFT721 (Unique artworks - ERC-721)
   • ArtNFT1155 (Limited editions - ERC-1155)
   • ArtToken (Governance token - ERC-20)
   • ArtMarketplace (Decentralized trading)

✅ Frontend Application
   • Next.js 14 with App Router
   • Web3 wallet integration
   • Gallery & marketplace UI
   • Artist minting interface

✅ Infrastructure
   • Comprehensive test suite (>90% coverage)
   • Event indexer service
   • CI/CD pipelines
   • Development scripts

✅ Documentation
   • Vision & principles
   • Architecture guide
   • API reference
   • Development guide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 QUICK START:

1. Setup Environment
   chmod +x scripts/setup-dev.sh
   ./scripts/setup-dev.sh

2. Start Local Blockchain (Terminal 1)
   cd contracts
   npx hardhat node

3. Deploy Contracts (Terminal 2)
   cd contracts
   pnpm deploy:localhost

4. Start Web App (Terminal 3)
   cd apps/web
   pnpm dev

5. Visit: http://localhost:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION:

• README.md              - Main documentation
• docs/VISION.md         - Project philosophy
• docs/ARCHITECTURE.md   - System design
• docs/API.md            - Contract API reference
• docs/DEVELOPMENT.md    - Developer guide
• CONTRIBUTING.md        - How to contribute

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTING:

Run contract tests:
   cd contracts && pnpm test

Generate coverage:
   cd contracts && pnpm test:coverage

Lint code:
   pnpm lint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 SECURITY:

• OpenZeppelin contracts
• Reentrancy protection
• Comprehensive testing
• Security policy in SECURITY.md

⚠️  Professional audit recommended before mainnet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏗️ PROJECT STRUCTURE:

/apps/web              → Next.js frontend
/contracts             → Solidity contracts
/packages/shared       → Shared types
/packages/indexer      → Event indexer
/tests                 → Contract tests
/scripts               → Helper scripts
/docs                  → Documentation
/.github/workflows     → CI/CD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CORE PRINCIPLES:

• Artist-First Design
• Provenance & Authenticity
• On-Chain Ownership
• Minimal Intermediaries
• Long-Term Preservation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📬 CONTACT:

Website: tokenizedart.xyz (coming soon)
Twitter: @tokenizedart
Discord: discord.gg/tokenizedart
Email:   hello@tokenizedart.xyz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built with ❤️  for artists and collectors

Licensed under MIT - Free and open source

⭐ Star the repo if you believe in artist empowerment!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

echo ""
echo "Ready to start? Run: ./scripts/setup-dev.sh"
echo ""
