# Smart Contract API Reference

## ArtNFT721

### Overview
ERC-721 contract for unique 1/1 artworks with built-in royalty support (EIP-2981).

### Constructor
```solidity
constructor(string memory name, string memory symbol)
```
- `name`: Collection name (e.g., "Tokenized Art")
- `symbol`: Collection symbol (e.g., "ART721")

### Functions

#### mintArtwork
```solidity
function mintArtwork(
    address artist,
    string memory title,
    string memory medium,
    uint256 creationDate,
    bytes32 artworkHash,
    string memory tokenURI,
    uint96 royaltyPercentage
) external nonReentrant returns (uint256)
```

Mints a new artwork NFT.

**Parameters**:
- `artist`: Artist's Ethereum address
- `title`: Artwork title
- `medium`: Art medium (e.g., "Digital", "Oil on Canvas")
- `creationDate`: Unix timestamp of creation
- `artworkHash`: keccak256 hash of artwork file
- `tokenURI`: IPFS/Arweave URI for metadata
- `royaltyPercentage`: Royalty in basis points (500 = 5%)

**Returns**: Token ID of minted artwork

**Events**: Emits `ArtworkMinted`

#### getArtworkMetadata
```solidity
function getArtworkMetadata(uint256 tokenId) 
    external 
    view 
    returns (ArtworkMetadata memory)
```

Returns complete metadata for an artwork.

#### totalSupply
```solidity
function totalSupply() external view returns (uint256)
```

Returns total number of artworks minted.

### Events

#### ArtworkMinted
```solidity
event ArtworkMinted(
    uint256 indexed tokenId,
    address indexed artist,
    string title,
    bytes32 artworkHash,
    uint96 royaltyPercentage
)
```

#### ArtworkTransferred
```solidity
event ArtworkTransferred(
    uint256 indexed tokenId,
    address indexed from,
    address indexed to
)
```

---

## ArtNFT1155

### Overview
ERC-1155 contract for limited edition artworks with supply management.

### Constructor
```solidity
constructor(string memory baseURI)
```
- `baseURI`: Base URI for token metadata

### Functions

#### createEdition
```solidity
function createEdition(
    address artist,
    string memory title,
    string memory medium,
    uint256 creationDate,
    bytes32 artworkHash,
    string memory tokenURI,
    uint96 royaltyPercentage,
    uint256 maxSupply
) external nonReentrant returns (uint256)
```

Creates a new edition series.

**Returns**: Edition token ID

#### mintEdition
```solidity
function mintEdition(
    address to,
    uint256 tokenId,
    uint256 amount
) external nonReentrant
```

Mints specific amount of an edition.

#### remainingSupply
```solidity
function remainingSupply(uint256 tokenId) 
    external 
    view 
    returns (uint256)
```

Returns remaining mintable supply for an edition.

#### canMintMore
```solidity
function canMintMore(uint256 tokenId) 
    external 
    view 
    returns (bool)
```

Checks if more editions can be minted.

### Events

#### EditionCreated
```solidity
event EditionCreated(
    uint256 indexed tokenId,
    address indexed artist,
    string title,
    uint256 maxSupply,
    bytes32 artworkHash,
    uint96 royaltyPercentage
)
```

#### EditionMinted
```solidity
event EditionMinted(
    uint256 indexed tokenId,
    address indexed to,
    uint256 amount
)
```

---

## ArtMarketplace

### Overview
Decentralized marketplace for buying and selling artwork NFTs.

### Constructor
```solidity
constructor(address _feeRecipient)
```
- `_feeRecipient`: Address to receive platform fees

### Functions

#### listERC721
```solidity
function listERC721(
    address nftContract,
    uint256 tokenId,
    uint256 price
) external nonReentrant returns (uint256)
```

Lists an ERC-721 artwork for sale.

**Returns**: Listing ID

#### listERC1155
```solidity
function listERC1155(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 amount
) external nonReentrant returns (uint256)
```

Lists ERC-1155 editions for sale.

#### buyArtwork
```solidity
function buyArtwork(uint256 listingId, uint256 amount) 
    external 
    payable 
    nonReentrant
```

Purchases artwork from a listing.

**Payment Distribution**:
1. Royalties paid to artist (via EIP-2981)
2. Platform fee deducted
3. Remaining amount to seller

#### cancelListing
```solidity
function cancelListing(uint256 listingId) external nonReentrant
```

Cancels an active listing (seller only).

#### updatePlatformFee
```solidity
function updatePlatformFee(uint96 newFee) external onlyOwner
```

Updates platform fee (owner only, max 10%).

### Events

#### ArtworkListed
```solidity
event ArtworkListed(
    uint256 indexed listingId,
    address indexed seller,
    address indexed nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 amount,
    bool isERC1155
)
```

#### ArtworkSold
```solidity
event ArtworkSold(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    uint256 price,
    uint256 royaltyAmount,
    uint256 platformFeeAmount
)
```

---

## ArtToken

### Overview
ERC-20 governance token (optional, isolated from core functionality).

### Constructor
```solidity
constructor(address initialOwner)
```

Mints 1 billion tokens to initial owner.

### Key Properties
- **Total Supply**: 1,000,000,000 tokens
- **Max Supply**: 1,000,000,000 (hard cap)
- **Decimals**: 18
- **Symbol**: ART

### Functions

Standard ERC-20 functions plus:

#### burn
```solidity
function burn(uint256 amount) public
```

Burns tokens (reduces supply).

#### maxSupply
```solidity
function maxSupply() external pure returns (uint256)
```

Returns maximum possible supply.

---

## Integration Examples

### Minting Artwork (Web3.js)
```javascript
const tx = await artNFT721.mintArtwork(
  artistAddress,
  "Sunset Dreams",
  "Digital Art",
  Math.floor(Date.now() / 1000),
  ethers.keccak256(ethers.toUtf8Bytes("artwork-data")),
  "ipfs://QmExample",
  500 // 5% royalty
);
```

### Listing on Marketplace
```javascript
// 1. Approve marketplace
await artNFT721.approve(marketplaceAddress, tokenId);

// 2. List artwork
await marketplace.listERC721(
  artNFT721Address,
  tokenId,
  ethers.parseEther("1.5") // 1.5 ETH
);
```

### Buying Artwork
```javascript
await marketplace.buyArtwork(listingId, 1, {
  value: ethers.parseEther("1.5")
});
```

---

## Gas Estimates

| Operation | Estimated Gas |
|-----------|---------------|
| Mint ERC-721 | ~180,000 |
| Mint ERC-1155 (first) | ~150,000 |
| List on Marketplace | ~80,000 |
| Buy Artwork | ~120,000 |
| Transfer ERC-721 | ~50,000 |

*Note: Gas estimates are approximate and vary by network conditions.*

## Security Notes

1. **Reentrancy**: All payable functions use `nonReentrant` modifier
2. **Access Control**: Proper validation of msg.sender
3. **Integer Overflow**: Solidity 0.8+ built-in checks
4. **Input Validation**: All parameters validated
5. **Royalty Cap**: Max royalty limited to 100%

---

**For detailed implementation, see contracts in `/contracts/contracts/`**
