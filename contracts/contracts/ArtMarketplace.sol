// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArtMarketplace
 * @notice Minimal marketplace for buying and selling artwork NFTs
 * @dev Supports both ERC-721 and ERC-1155 tokens with royalty enforcement
 * 
 * Features:
 * - List artworks for sale
 * - Buy artworks directly
 * - Automatic royalty payments (EIP-2981)
 * - No aggressive trading features
 * - Focus on clarity and simplicity
 */
contract ArtMarketplace is ReentrancyGuard, Ownable {
    // Listing structure
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        uint256 amount; // For ERC-1155, 1 for ERC-721
        bool isERC1155;
        bool active;
    }

    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint96 public platformFee = 250;
    address public feeRecipient;

    // Mapping from listing ID to Listing
    mapping(uint256 => Listing) public listings;
    uint256 private _listingIds;

    // Events
    event ArtworkListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        bool isERC1155
    );

    event ArtworkSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 royaltyAmount,
        uint256 platformFeeAmount
    );

    event ListingCancelled(uint256 indexed listingId);

    event PlatformFeeUpdated(uint96 newFee);

    event FeeRecipientUpdated(address newRecipient);

    /**
     * @notice Contract constructor
     * @param _feeRecipient The address to receive platform fees
     */
    constructor(address _feeRecipient) Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice List an ERC-721 artwork for sale
     * @param nftContract The NFT contract address
     * @param tokenId The token ID
     * @param price The sale price in wei
     */
    function listERC721(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        _listingIds++;
        uint256 listingId = _listingIds;

        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            amount: 1,
            isERC1155: false,
            active: true
        });

        emit ArtworkListed(listingId, msg.sender, nftContract, tokenId, price, 1, false);

        return listingId;
    }

    /**
     * @notice List ERC-1155 editions for sale
     * @param nftContract The NFT contract address
     * @param tokenId The token ID
     * @param price The sale price per edition in wei
     * @param amount The number of editions to list
     */
    function listERC1155(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC1155 nft = IERC1155(nftContract);
        require(nft.balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        _listingIds++;
        uint256 listingId = _listingIds;

        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            amount: amount,
            isERC1155: true,
            active: true
        });

        emit ArtworkListed(listingId, msg.sender, nftContract, tokenId, price, amount, true);

        return listingId;
    }

    /**
     * @notice Buy an artwork
     * @param listingId The listing ID
     * @param amount The amount to buy (1 for ERC-721, can be >1 for ERC-1155)
     */
    function buyArtwork(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(amount > 0 && amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = listing.price * amount;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Calculate royalty (EIP-2981)
        (address royaltyRecipient, uint256 royaltyAmount) = _getRoyaltyInfo(
            listing.nftContract,
            listing.tokenId,
            totalPrice
        );

        // Calculate platform fee
        uint256 platformFeeAmount = (totalPrice * platformFee) / 10000;

        // Calculate seller proceeds
        uint256 sellerProceeds = totalPrice - royaltyAmount - platformFeeAmount;

        // Transfer NFT
        if (listing.isERC1155) {
            IERC1155(listing.nftContract).safeTransferFrom(
                listing.seller,
                msg.sender,
                listing.tokenId,
                amount,
                ""
            );
            listing.amount -= amount;
            if (listing.amount == 0) {
                listing.active = false;
            }
        } else {
            IERC721(listing.nftContract).safeTransferFrom(
                listing.seller,
                msg.sender,
                listing.tokenId
            );
            listing.active = false;
        }

        // Transfer payments
        if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
            (bool royaltySuccess, ) = royaltyRecipient.call{value: royaltyAmount}("");
            require(royaltySuccess, "Royalty transfer failed");
        }

        if (platformFeeAmount > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: platformFeeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }

        (bool sellerSuccess, ) = listing.seller.call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller payment failed");

        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refundSuccess, "Refund failed");
        }

        emit ArtworkSold(listingId, msg.sender, listing.seller, totalPrice, royaltyAmount, platformFeeAmount);
    }

    /**
     * @notice Cancel a listing
     * @param listingId The listing ID
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;

        emit ListingCancelled(listingId);
    }

    /**
     * @notice Update platform fee (owner only)
     * @param newFee The new platform fee in basis points
     */
    function updatePlatformFee(uint96 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    /**
     * @notice Update fee recipient (owner only)
     * @param newRecipient The new fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    /**
     * @notice Get royalty info for a token
     * @param nftContract The NFT contract address
     * @param tokenId The token ID
     * @param salePrice The sale price
     * @return recipient The royalty recipient
     * @return amount The royalty amount
     */
    function _getRoyaltyInfo(
        address nftContract,
        uint256 tokenId,
        uint256 salePrice
    ) private view returns (address recipient, uint256 amount) {
        try ERC2981(nftContract).royaltyInfo(tokenId, salePrice) returns (
            address _recipient,
            uint256 _amount
        ) {
            return (_recipient, _amount);
        } catch {
            return (address(0), 0);
        }
    }

    /**
     * @notice Get total listing count
     * @return The total number of listings created
     */
    function totalListings() external view returns (uint256) {
        return _listingIds;
    }

    /**
     * @notice Check if a listing is active
     * @param listingId The listing ID
     * @return Whether the listing is active
     */
    function isListingActive(uint256 listingId) external view returns (bool) {
        return listings[listingId].active;
    }
}
