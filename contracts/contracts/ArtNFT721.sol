// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArtNFT721
 * @notice ERC-721 contract for 1/1 art pieces with built-in royalties (EIP-2981)
 * @dev Implements:
 * - ERC-721 for unique artwork ownership
 * - ERC-2981 for creator royalties on secondary sales
 * - Immutable provenance and metadata
 * - Artist-first design with no admin rug privileges
 */
contract ArtNFT721 is ERC721, ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Artwork metadata structure
    struct ArtworkMetadata {
        address artist;
        string title;
        string medium;
        uint256 creationDate;
        bytes32 artworkHash;
        uint96 royaltyPercentage; // In basis points (e.g., 500 = 5%)
    }

    // Mapping from token ID to artwork metadata
    mapping(uint256 => ArtworkMetadata) public artworkMetadata;

    // Events
    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string title,
        bytes32 artworkHash,
        uint96 royaltyPercentage
    );

    event ArtworkTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    /**
     * @notice Contract constructor
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection
     */
    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {}

    /**
     * @notice Mint a new artwork NFT
     * @param artist The address of the artist
     * @param title The title of the artwork
     * @param medium The medium of the artwork (e.g., "Digital", "Oil on Canvas")
     * @param creationDate The creation date (Unix timestamp)
     * @param artworkHash The hash of the artwork file (for verification)
     * @param tokenURI The URI pointing to the artwork metadata (IPFS/Arweave)
     * @param royaltyPercentage The royalty percentage in basis points (e.g., 500 = 5%)
     * @return tokenId The ID of the newly minted token
     */
    function mintArtwork(
        address artist,
        string memory title,
        string memory medium,
        uint256 creationDate,
        bytes32 artworkHash,
        string memory tokenURI,
        uint96 royaltyPercentage
    ) external nonReentrant returns (uint256) {
        require(artist != address(0), "Invalid artist address");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(royaltyPercentage <= 10000, "Royalty percentage too high"); // Max 100%

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(artist, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Set royalty info (EIP-2981)
        _setTokenRoyalty(newTokenId, artist, royaltyPercentage);

        // Store metadata
        artworkMetadata[newTokenId] = ArtworkMetadata({
            artist: artist,
            title: title,
            medium: medium,
            creationDate: creationDate,
            artworkHash: artworkHash,
            royaltyPercentage: royaltyPercentage
        });

        emit ArtworkMinted(newTokenId, artist, title, artworkHash, royaltyPercentage);

        return newTokenId;
    }

    /**
     * @notice Get the total number of minted artworks
     * @return The total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @notice Get artwork metadata
     * @param tokenId The token ID
     * @return The artwork metadata struct
     */
    function getArtworkMetadata(uint256 tokenId) external view returns (ArtworkMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return artworkMetadata[tokenId];
    }

    /**
     * @notice Override to track transfers
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit ArtworkTransferred(tokenId, from, to);
        }
        
        return previousOwner;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
