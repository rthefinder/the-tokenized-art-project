import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ArtMarketplace, ArtNFT721, ArtNFT1155 } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('ArtMarketplace', function () {
  let marketplace: ArtMarketplace;
  let artNFT721: ArtNFT721;
  let artNFT1155: ArtNFT1155;
  let owner: SignerWithAddress;
  let artist: SignerWithAddress;
  let buyer: SignerWithAddress;
  let feeRecipient: SignerWithAddress;

  const ARTWORK_HASH = ethers.keccak256(ethers.toUtf8Bytes('artwork'));
  const TOKEN_URI = 'ipfs://QmTest';
  const ROYALTY_PERCENTAGE = 500; // 5%
  const LISTING_PRICE = ethers.parseEther('1');

  beforeEach(async function () {
    [owner, artist, buyer, feeRecipient] = await ethers.getSigners();

    // Deploy NFT contracts
    const ArtNFT721Factory = await ethers.getContractFactory('ArtNFT721');
    artNFT721 = await ArtNFT721Factory.deploy('Tokenized Art', 'ART721');
    await artNFT721.waitForDeployment();

    const ArtNFT1155Factory = await ethers.getContractFactory('ArtNFT1155');
    artNFT1155 = await ArtNFT1155Factory.deploy('https://api.tokenizedart.xyz/');
    await artNFT1155.waitForDeployment();

    // Deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory('ArtMarketplace');
    marketplace = await MarketplaceFactory.deploy(feeRecipient.address);
    await marketplace.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set correct fee recipient', async function () {
      expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
    });

    it('Should set default platform fee', async function () {
      expect(await marketplace.platformFee()).to.equal(250); // 2.5%
    });
  });

  describe('ERC721 Listings', function () {
    let tokenId: bigint;

    beforeEach(async function () {
      // Mint artwork to artist
      const tx = await artNFT721.mintArtwork(
        artist.address,
        'Test Art',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );
      const receipt = await tx.wait();
      tokenId = 1n;

      // Approve marketplace
      await artNFT721.connect(artist).approve(await marketplace.getAddress(), tokenId);
    });

    it('Should list ERC721 artwork successfully', async function () {
      const tx = await marketplace.connect(artist).listERC721(
        await artNFT721.getAddress(),
        tokenId,
        LISTING_PRICE
      );

      await expect(tx)
        .to.emit(marketplace, 'ArtworkListed')
        .withArgs(1, artist.address, await artNFT721.getAddress(), tokenId, LISTING_PRICE, 1, false);

      expect(await marketplace.totalListings()).to.equal(1);
      expect(await marketplace.isListingActive(1)).to.be.true;
    });

    it('Should revert if not the owner', async function () {
      await expect(
        marketplace.connect(buyer).listERC721(
          await artNFT721.getAddress(),
          tokenId,
          LISTING_PRICE
        )
      ).to.be.revertedWith('Not the owner');
    });

    it('Should revert if marketplace not approved', async function () {
      // Mint another token without approval
      await artNFT721.mintArtwork(
        artist.address,
        'Test Art 2',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      await expect(
        marketplace.connect(artist).listERC721(
          await artNFT721.getAddress(),
          2,
          LISTING_PRICE
        )
      ).to.be.revertedWith('Marketplace not approved');
    });
  });

  describe('ERC721 Sales', function () {
    let tokenId: bigint;
    let listingId: bigint;

    beforeEach(async function () {
      // Mint and list artwork
      await artNFT721.mintArtwork(
        artist.address,
        'Test Art',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );
      tokenId = 1n;

      await artNFT721.connect(artist).approve(await marketplace.getAddress(), tokenId);
      const tx = await marketplace.connect(artist).listERC721(
        await artNFT721.getAddress(),
        tokenId,
        LISTING_PRICE
      );
      listingId = 1n;
    });

    it('Should buy artwork successfully', async function () {
      const tx = await marketplace.connect(buyer).buyArtwork(listingId, 1, {
        value: LISTING_PRICE,
      });

      await expect(tx).to.emit(marketplace, 'ArtworkSold');

      expect(await artNFT721.ownerOf(tokenId)).to.equal(buyer.address);
      expect(await marketplace.isListingActive(listingId)).to.be.false;
    });

    it('Should distribute payments correctly', async function () {
      const initialArtistBalance = await ethers.provider.getBalance(artist.address);
      const initialFeeBalance = await ethers.provider.getBalance(feeRecipient.address);

      await marketplace.connect(buyer).buyArtwork(listingId, 1, {
        value: LISTING_PRICE,
      });

      const finalArtistBalance = await ethers.provider.getBalance(artist.address);
      const finalFeeBalance = await ethers.provider.getBalance(feeRecipient.address);

      // Calculate expected amounts
      const royaltyAmount = (LISTING_PRICE * BigInt(ROYALTY_PERCENTAGE)) / 10000n;
      const platformFeeAmount = (LISTING_PRICE * 250n) / 10000n;
      const sellerProceeds = LISTING_PRICE - royaltyAmount - platformFeeAmount;

      expect(finalArtistBalance - initialArtistBalance).to.equal(sellerProceeds + royaltyAmount);
      expect(finalFeeBalance - initialFeeBalance).to.equal(platformFeeAmount);
    });

    it('Should refund excess payment', async function () {
      const overpayment = ethers.parseEther('0.5');
      const initialBalance = await ethers.provider.getBalance(buyer.address);

      const tx = await marketplace.connect(buyer).buyArtwork(listingId, 1, {
        value: LISTING_PRICE + overpayment,
      });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalBalance = await ethers.provider.getBalance(buyer.address);

      expect(initialBalance - finalBalance).to.be.closeTo(
        LISTING_PRICE + gasUsed,
        ethers.parseEther('0.001') // Small tolerance for gas variations
      );
    });

    it('Should revert if payment is insufficient', async function () {
      await expect(
        marketplace.connect(buyer).buyArtwork(listingId, 1, {
          value: LISTING_PRICE - 1n,
        })
      ).to.be.revertedWith('Insufficient payment');
    });
  });

  describe('ERC1155 Listings', function () {
    let editionId: bigint;

    beforeEach(async function () {
      // Create and mint edition
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        100
      );
      editionId = 1n;

      await artNFT1155.mintEdition(artist.address, editionId, 10);
      await artNFT1155.connect(artist).setApprovalForAll(await marketplace.getAddress(), true);
    });

    it('Should list ERC1155 editions successfully', async function () {
      const tx = await marketplace.connect(artist).listERC1155(
        await artNFT1155.getAddress(),
        editionId,
        LISTING_PRICE,
        5
      );

      await expect(tx).to.emit(marketplace, 'ArtworkListed');
      expect(await marketplace.isListingActive(1)).to.be.true;
    });

    it('Should buy multiple editions', async function () {
      await marketplace.connect(artist).listERC1155(
        await artNFT1155.getAddress(),
        editionId,
        LISTING_PRICE,
        5
      );

      await marketplace.connect(buyer).buyArtwork(1, 3, {
        value: LISTING_PRICE * 3n,
      });

      expect(await artNFT1155.balanceOf(buyer.address, editionId)).to.equal(3);
    });
  });

  describe('Listing Management', function () {
    let tokenId: bigint;
    let listingId: bigint;

    beforeEach(async function () {
      await artNFT721.mintArtwork(
        artist.address,
        'Test Art',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );
      tokenId = 1n;

      await artNFT721.connect(artist).approve(await marketplace.getAddress(), tokenId);
      await marketplace.connect(artist).listERC721(
        await artNFT721.getAddress(),
        tokenId,
        LISTING_PRICE
      );
      listingId = 1n;
    });

    it('Should cancel listing', async function () {
      await expect(marketplace.connect(artist).cancelListing(listingId))
        .to.emit(marketplace, 'ListingCancelled')
        .withArgs(listingId);

      expect(await marketplace.isListingActive(listingId)).to.be.false;
    });

    it('Should revert if not the seller', async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(listingId)
      ).to.be.revertedWith('Not the seller');
    });
  });

  describe('Platform Fee Management', function () {
    it('Should update platform fee', async function () {
      await expect(marketplace.updatePlatformFee(500))
        .to.emit(marketplace, 'PlatformFeeUpdated')
        .withArgs(500);

      expect(await marketplace.platformFee()).to.equal(500);
    });

    it('Should revert if fee is too high', async function () {
      await expect(marketplace.updatePlatformFee(1001)).to.be.revertedWith('Fee too high');
    });

    it('Should revert if not owner', async function () {
      await expect(
        marketplace.connect(artist).updatePlatformFee(500)
      ).to.be.revertedWithCustomError(marketplace, 'OwnableUnauthorizedAccount');
    });
  });
});
