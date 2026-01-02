// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArtNFT1155
 * @notice ERC-1155 contract for edition artworks with built-in royalties (EIP-2981)
 * @dev Implements:
 * - ERC-1155 for edition-based artwork ownership
 * - ERC-2981 for creator royalties on secondary sales
 * - Limited edition minting
 * - Artist-first design with no admin rug privileges
 */
contract ArtNFT1155 is ERC1155, ERC1155URIStorage, ERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Edition metadata structure
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

    // Mapping from token ID to edition metadata
    mapping(uint256 => EditionMetadata) public editionMetadata;

    // Events
    event EditionCreated(
        uint256 indexed tokenId,
        address indexed artist,
        string title,
        uint256 maxSupply,
        bytes32 artworkHash,
        uint96 royaltyPercentage
    );

    event EditionMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 amount
    );

    /**
     * @notice Contract constructor
     * @param baseURI The base URI for token metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    /**
     * @notice Create a new edition
     * @param artist The address of the artist
     * @param title The title of the artwork
     * @param medium The medium of the artwork
     * @param creationDate The creation date (Unix timestamp)
     * @param artworkHash The hash of the artwork file
     * @param tokenURI The URI for this specific edition's metadata
     * @param royaltyPercentage The royalty percentage in basis points
     * @param maxSupply The maximum number of editions that can be minted
     * @return tokenId The ID of the newly created edition
     */
    function createEdition(
        address artist,
        string memory title,
        string memory medium,
        uint256 creationDate,
        bytes32 artworkHash,
        string memory tokenURI,
        uint96 royaltyPercentage,
        uint256 maxSupply
    ) external nonReentrant returns (uint256) {
        require(artist != address(0), "Invalid artist address");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(royaltyPercentage <= 10000, "Royalty percentage too high");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _setURI(newTokenId, tokenURI);

        // Set royalty info (EIP-2981)
        _setTokenRoyalty(newTokenId, artist, royaltyPercentage);

        // Store metadata
        editionMetadata[newTokenId] = EditionMetadata({
            artist: artist,
            title: title,
            medium: medium,
            creationDate: creationDate,
            artworkHash: artworkHash,
            royaltyPercentage: royaltyPercentage,
            maxSupply: maxSupply,
            currentSupply: 0
        });

        emit EditionCreated(newTokenId, artist, title, maxSupply, artworkHash, royaltyPercentage);

        return newTokenId;
    }

    /**
     * @notice Mint editions to a recipient
     * @param to The recipient address
     * @param tokenId The edition token ID
     * @param amount The number of editions to mint
     */
    function mintEdition(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");

        EditionMetadata storage metadata = editionMetadata[tokenId];
        require(metadata.artist != address(0), "Edition does not exist");
        require(
            metadata.currentSupply + amount <= metadata.maxSupply,
            "Exceeds max supply"
        );

        metadata.currentSupply += amount;

        _mint(to, tokenId, amount, "");

        emit EditionMinted(tokenId, to, amount);
    }

    /**
     * @notice Get the total number of edition types created
     * @return The total number of unique editions
     */
    function totalEditions() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @notice Get edition metadata
     * @param tokenId The token ID
     * @return The edition metadata struct
     */
    function getEditionMetadata(uint256 tokenId) external view returns (EditionMetadata memory) {
        require(editionMetadata[tokenId].artist != address(0), "Edition does not exist");
        return editionMetadata[tokenId];
    }

    /**
     * @notice Check if more editions can be minted
     * @param tokenId The token ID
     * @return Whether more editions can be minted
     */
    function canMintMore(uint256 tokenId) external view returns (bool) {
        EditionMetadata memory metadata = editionMetadata[tokenId];
        return metadata.currentSupply < metadata.maxSupply;
    }

    /**
     * @notice Get remaining mintable supply
     * @param tokenId The token ID
     * @return The remaining supply that can be minted
     */
    function remainingSupply(uint256 tokenId) external view returns (uint256) {
        EditionMetadata memory metadata = editionMetadata[tokenId];
        return metadata.maxSupply - metadata.currentSupply;
    }

    // Required overrides
    function uri(uint256 tokenId)
        public
        view
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return super.uri(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
