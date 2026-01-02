# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js App (apps/web)                              │  │
│  │  - Gallery & Marketplace UI                          │  │
│  │  - Wallet Integration (wagmi/viem)                   │  │
│  │  - Artist Minting Interface                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Layer (EVM)                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ ArtNFT721  │  │ ArtNFT1155 │  │ ArtToken   │           │
│  │ (1/1 Art)  │  │ (Editions) │  │ (ERC-20)   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ArtMarketplace                                       │  │
│  │  - Listings & Sales                                   │  │
│  │  - Royalty Distribution (EIP-2981)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Indexing Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Event Indexer (packages/indexer)                     │  │
│  │  - Mint Events                                        │  │
│  │  - Transfer Events                                    │  │
│  │  - Sale Events                                        │  │
│  │  - Provenance Building                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │    IPFS    │  │  Arweave   │  │  Metadata  │           │
│  │ (Artwork)  │  │(Permanent) │  │   (JSON)   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### ArtNFT721
**Purpose**: Unique 1/1 artwork ownership

**Key Features**:
- ERC-721 standard compliance
- EIP-2981 royalty support
- Immutable metadata storage
- Artist attribution
- Artwork hash verification

**Data Structure**:
```solidity
struct ArtworkMetadata {
    address artist;
    string title;
    string medium;
    uint256 creationDate;
    bytes32 artworkHash;
    uint96 royaltyPercentage;
}
```

### ArtNFT1155
**Purpose**: Limited edition artwork series

**Key Features**:
- ERC-1155 standard compliance
- Edition supply management
- Per-edition royalties
- Batch minting support

**Data Structure**:
```solidity
struct EditionMetadata {
    address artist;
    string title;
    string medium;
    uint256 creationDate;
    bytes32 artworkHash;
    uint96 royaltyPercentage;
    uint256 maxSupply;
    uint256 currentSupply;
}
```

### ArtMarketplace
**Purpose**: Decentralized artwork trading

**Key Features**:
- List ERC-721 and ERC-1155
- Direct purchase mechanism
- Automatic royalty distribution
- Platform fee collection
- Listing cancellation

**Flow**:
1. Artist approves marketplace
2. Artwork listed with price
3. Buyer purchases with ETH
4. Royalties automatically distributed
5. NFT transferred to buyer

### ArtToken (Optional)
**Purpose**: Governance and community utility

**Key Features**:
- ERC-20 standard
- Fixed supply (1B tokens)
- Governance rights
- Community signaling
- NOT a financial instrument

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Wallet**: wagmi + viem + ConnectKit
- **State**: React Query
- **Type Safety**: TypeScript strict mode

### Page Structure
```
/                    → Landing page
/gallery             → Browse all artworks
/gallery/[id]        → Individual artwork page
/marketplace         → Active listings
/marketplace/[id]    → Listing detail
/mint                → Artist minting interface
/artist/[address]    → Artist profile
/collector/[address] → Collector profile
/about               → Project information
```

### Key Components
- **Header**: Navigation + wallet connection
- **ArtworkCard**: Artwork preview with metadata
- **ListingCard**: Marketplace listing display
- **MintForm**: Artist artwork submission
- **ProvenanceTimeline**: Ownership history
- **WalletConnect**: Web3 connection management

## Data Flow

### Minting Flow
```
1. Artist uploads artwork to IPFS
2. Artist fills mint form (metadata)
3. Frontend generates metadata JSON
4. Upload metadata to IPFS
5. Call mintArtwork() on contract
6. Transaction confirmed
7. Indexer picks up event
8. UI updates with new artwork
```

### Purchase Flow
```
1. Collector browses marketplace
2. Selects artwork to purchase
3. Clicks "Buy Now"
4. Wallet prompts for approval
5. buyArtwork() called with payment
6. Contract calculates royalties
7. Funds distributed automatically
8. NFT transferred to buyer
9. Indexer updates provenance
10. UI reflects new owner
```

### Provenance Tracking
```
1. Indexer monitors Transfer events
2. Events stored with timestamps
3. Provenance chain built
4. Frontend queries history
5. Timeline rendered for collectors
```

## Indexing Strategy

### Event Monitoring
- **Mint Events**: New artwork creation
- **Transfer Events**: Ownership changes
- **Sale Events**: Marketplace transactions
- **List Events**: New marketplace listings

### Data Storage
In production, indexed data should be stored in:
- **PostgreSQL**: Relational metadata
- **Redis**: Caching layer
- **IPFS**: Decentralized backup

For MVP, in-memory or simple file-based storage suffices.

## Security Considerations

### Smart Contracts
- ✅ Reentrancy guards on all payable functions
- ✅ OpenZeppelin audited contracts
- ✅ No upgradeable proxies (immutability)
- ✅ Access control via Ownable
- ✅ Input validation on all parameters

### Frontend
- ✅ Input sanitization
- ✅ HTTPS only
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ Wallet signature verification

### IPFS/Storage
- ✅ Content-addressed storage (CIDs)
- ✅ Hash verification on-chain
- ✅ Multiple pinning services
- ✅ Arweave permanent backup

## Scalability

### Layer 2 Considerations
For production deployment, consider:
- **Optimism**: Low fees, EVM compatibility
- **Arbitrum**: Fast finality
- **Base**: Coinbase-backed L2
- **Polygon**: Established ecosystem

### Indexing at Scale
- Event batching
- Parallel processing
- Incremental updates
- Caching strategies

### Storage Optimization
- Thumbnail generation
- Lazy loading
- CDN integration
- Image optimization

## Deployment Strategy

### Development
```bash
1. Local Hardhat node
2. Deploy contracts
3. Run indexer locally
4. Start Next.js dev server
```

### Testnet (Sepolia)
```bash
1. Deploy to Sepolia
2. Verify contracts on Etherscan
3. Update frontend with addresses
4. Test full user flows
```

### Mainnet
```bash
1. Security audit
2. Deploy to Ethereum mainnet
3. Verify contracts
4. Monitor via Tenderly
5. Gradual rollout
```

## Monitoring & Maintenance

### Key Metrics
- Total artworks minted
- Active listings
- Sales volume
- Unique artists
- Unique collectors
- Average royalty percentage
- Platform fees collected

### Health Checks
- Contract balance monitoring
- Indexer sync status
- IPFS gateway uptime
- Frontend error rates
- Transaction success rates

---

**This architecture prioritizes simplicity, security, and artist empowerment.**
