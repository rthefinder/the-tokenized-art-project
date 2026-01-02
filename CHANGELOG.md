# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-02

### Added
- Initial release of The Tokenized Art Project
- ERC-721 contract for unique 1/1 artworks (ArtNFT721)
- ERC-1155 contract for limited editions (ArtNFT1155)
- ERC-20 governance token (ArtToken)
- Decentralized marketplace (ArtMarketplace)
- EIP-2981 royalty standard implementation
- Next.js frontend with gallery and marketplace
- Event indexing service
- Comprehensive test suite (>90% coverage)
- Documentation (Vision, Architecture, API, Development)
- CI/CD pipelines (GitHub Actions)
- Development setup scripts
- Monorepo structure with Turborepo
- IPFS/Arweave integration for storage
- Wallet connection (wagmi + viem + ConnectKit)

### Security
- Reentrancy protection on all payable functions
- OpenZeppelin contract dependencies
- Input validation on all contract functions
- No upgradeable proxies (immutability by design)

[1.0.0]: https://github.com/rthefinder/the-tokenized-art-project/releases/tag/v1.0.0
