# 🎨 The Tokenized Art Project ($ART)

<img width="809" height="1024" alt="Capture d’écran 2026-01-02 à 19 23 43" src="https://github.com/user-attachments/assets/d0cc1a1d-908b-4f69-bf4e-dc0fde1e9525" />


> **A transparent, artist-first platform for tokenizing artwork and establishing verifiable ownership on the blockchain.**

The Tokenized Art Project is a comprehensive Web3 platform that empowers artists to mint, sell, and preserve their artwork as NFTs while maintaining complete ownership rights and earning perpetual royalties.

## ✨ Features

- 🖼️ **Artwork Tokenization** - Mint unique 1/1 artworks (ERC-721) or limited editions (ERC-1155)
- 👨‍🎨 **Artist Royalties** - EIP-2981 royalty standard with automatic distribution
- 🏛️ **Decentralized Marketplace** - Buy and sell artworks with transparent pricing
- 📜 **Provenance Tracking** - Complete ownership history on-chain
- 💾 **Permanent Preservation** - IPFS/Arweave integration for artwork storage
- 🌐 **Modern Web Interface** - Next.js 14 with Web3 wallet integration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/rthefinder/the-tokenized-art-project.git
cd the-tokenized-art-project

# Run the quick setup script
./QUICKSTART.sh
```

Or manually:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp contracts/.env.example contracts/.env
cp packages/indexer/.env.example packages/indexer/.env

# Start development
pnpm dev
```

## 📁 Project Structure

```
the-tokenized-art-project/
├── apps/
│   └── web/                    # Next.js frontend application
├── contracts/                  # Solidity smart contracts
│   ├── contracts/              # Contract source files
│   ├── scripts/                # Deployment scripts
│   └── tests/                  # Contract tests
├── packages/
│   ├── shared/                 # Shared TypeScript types & utilities
│   └── indexer/                # Blockchain event indexer
├── docs/                       # Comprehensive documentation
└── scripts/                    # Helper scripts
```

## 🔧 Technology Stack

### Smart Contracts
- **Solidity** 0.8.24
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contract libraries
- **EIP-2981** - Royalty standard

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **wagmi + viem** - Web3 integration
- **ConnectKit** - Wallet connection UI

### Infrastructure
- **Turborepo** - Monorepo management
- **pnpm** - Fast, efficient package manager
- **GitHub Actions** - CI/CD pipelines

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run contract tests only
cd contracts && pnpm test

# Run with coverage
cd contracts && pnpm test:coverage

# Run with gas reporting
cd contracts && pnpm test:gas
```

## 📚 Documentation

- [**Vision & Philosophy**](docs/VISION.md) - Why we're building this
- [**Architecture**](docs/ARCHITECTURE.md) - System design and technical details
- [**API Reference**](docs/API.md) - Smart contract API documentation
- [**Development Guide**](docs/DEVELOPMENT.md) - Developer workflow and best practices
- [**Environment Variables**](docs/ENVIRONMENT.md) - Configuration reference

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 🔒 Security

Security is our top priority. Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Key Contracts

### ArtNFT721
ERC-721 contract for unique 1/1 artworks with built-in royalty support.

```solidity
function mint(
    address to,
    string calldata tokenURI,
    uint96 royaltyFee
) external returns (uint256)
```

### ArtNFT1155
ERC-1155 contract for limited edition artwork series.

```solidity
function mint(
    address to,
    uint256 amount,
    string calldata tokenURI,
    uint96 royaltyFee
) external returns (uint256)
```

### ArtMarketplace
Decentralized marketplace with automatic royalty distribution.

```solidity
function listItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
) external

function buyItem(
    address nftContract,
    uint256 tokenId
) external payable
```

## 🎯 Roadmap

- [x] Core smart contracts (ERC-721, ERC-1155, Marketplace)
- [x] Frontend application with Web3 integration
- [x] Event indexer for blockchain data
- [x] Comprehensive testing suite
- [x] CI/CD pipelines
- [ ] Mobile application
- [ ] Layer 2 deployment (Arbitrum/Optimism)
- [ ] IPFS pinning service
- [ ] Artist verification system
- [ ] Advanced marketplace features (auctions, offers)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rthefinder/the-tokenized-art-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rthefinder/the-tokenized-art-project/discussions)

## 🙏 Acknowledgments

Built with support from the Web3 and NFT communities. Special thanks to all contributors and the OpenZeppelin team for their security-audited contracts.

---

**Made with ❤️ for artists and collectors**
