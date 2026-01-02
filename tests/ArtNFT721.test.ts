import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ArtNFT721 } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('ArtNFT721', function () {
  let artNFT721: ArtNFT721;
  let owner: SignerWithAddress;
  let artist: SignerWithAddress;
  let collector: SignerWithAddress;
  let addr3: SignerWithAddress;

  const ARTWORK_HASH = ethers.keccak256(ethers.toUtf8Bytes('artwork-content'));
  const TOKEN_URI = 'ipfs://QmTest123';
  const ROYALTY_PERCENTAGE = 500; // 5%

  beforeEach(async function () {
    [owner, artist, collector, addr3] = await ethers.getSigners();

    const ArtNFT721Factory = await ethers.getContractFactory('ArtNFT721');
    artNFT721 = await ArtNFT721Factory.deploy('Tokenized Art', 'ART721');
    await artNFT721.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the correct name and symbol', async function () {
      expect(await artNFT721.name()).to.equal('Tokenized Art');
      expect(await artNFT721.symbol()).to.equal('ART721');
    });

    it('Should set the correct owner', async function () {
      expect(await artNFT721.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', function () {
    it('Should mint artwork successfully', async function () {
      const tx = await artNFT721.mintArtwork(
        artist.address,
        'Sunset Dreams',
        'Digital',
        Math.floor(Date.now() / 1000),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      await expect(tx)
        .to.emit(artNFT721, 'ArtworkMinted')
        .withArgs(1, artist.address, 'Sunset Dreams', ARTWORK_HASH, ROYALTY_PERCENTAGE);

      expect(await artNFT721.ownerOf(1)).to.equal(artist.address);
      expect(await artNFT721.tokenURI(1)).to.equal(TOKEN_URI);
    });

    it('Should increment token IDs correctly', async function () {
      await artNFT721.mintArtwork(
        artist.address,
        'Artwork 1',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      await artNFT721.mintArtwork(
        artist.address,
        'Artwork 2',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      expect(await artNFT721.totalSupply()).to.equal(2);
    });

    it('Should revert if artist address is invalid', async function () {
      await expect(
        artNFT721.mintArtwork(
          ethers.ZeroAddress,
          'Test',
          'Digital',
          Date.now(),
          ARTWORK_HASH,
          TOKEN_URI,
          ROYALTY_PERCENTAGE
        )
      ).to.be.revertedWith('Invalid artist address');
    });

    it('Should revert if title is empty', async function () {
      await expect(
        artNFT721.mintArtwork(
          artist.address,
          '',
          'Digital',
          Date.now(),
          ARTWORK_HASH,
          TOKEN_URI,
          ROYALTY_PERCENTAGE
        )
      ).to.be.revertedWith('Title cannot be empty');
    });

    it('Should revert if royalty percentage is too high', async function () {
      await expect(
        artNFT721.mintArtwork(
          artist.address,
          'Test',
          'Digital',
          Date.now(),
          ARTWORK_HASH,
          TOKEN_URI,
          10001 // > 100%
        )
      ).to.be.revertedWith('Royalty percentage too high');
    });

    it('Should store metadata correctly', async function () {
      const creationDate = Math.floor(Date.now() / 1000);
      await artNFT721.mintArtwork(
        artist.address,
        'Test Artwork',
        'Oil on Canvas',
        creationDate,
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      const metadata = await artNFT721.getArtworkMetadata(1);
      expect(metadata.artist).to.equal(artist.address);
      expect(metadata.title).to.equal('Test Artwork');
      expect(metadata.medium).to.equal('Oil on Canvas');
      expect(metadata.creationDate).to.equal(creationDate);
      expect(metadata.artworkHash).to.equal(ARTWORK_HASH);
      expect(metadata.royaltyPercentage).to.equal(ROYALTY_PERCENTAGE);
    });
  });

  describe('Transfers', function () {
    beforeEach(async function () {
      await artNFT721.mintArtwork(
        artist.address,
        'Test',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );
    });

    it('Should transfer artwork successfully', async function () {
      await artNFT721.connect(artist).transferFrom(artist.address, collector.address, 1);
      expect(await artNFT721.ownerOf(1)).to.equal(collector.address);
    });

    it('Should emit transfer event', async function () {
      await expect(artNFT721.connect(artist).transferFrom(artist.address, collector.address, 1))
        .to.emit(artNFT721, 'ArtworkTransferred')
        .withArgs(1, artist.address, collector.address);
    });
  });

  describe('Royalties (EIP-2981)', function () {
    beforeEach(async function () {
      await artNFT721.mintArtwork(
        artist.address,
        'Test',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );
    });

    it('Should return correct royalty info', async function () {
      const salePrice = ethers.parseEther('1');
      const [recipient, amount] = await artNFT721.royaltyInfo(1, salePrice);

      expect(recipient).to.equal(artist.address);
      expect(amount).to.equal(salePrice * BigInt(ROYALTY_PERCENTAGE) / BigInt(10000));
    });

    it('Should support EIP-2981 interface', async function () {
      const EIP2981_INTERFACE_ID = '0x2a55205a';
      expect(await artNFT721.supportsInterface(EIP2981_INTERFACE_ID)).to.be.true;
    });
  });

  describe('Edge Cases', function () {
    it('Should revert when getting metadata for non-existent token', async function () {
      await expect(artNFT721.getArtworkMetadata(999)).to.be.revertedWith('Token does not exist');
    });

    it('Should handle multiple artworks from same artist', async function () {
      await artNFT721.mintArtwork(
        artist.address,
        'Artwork 1',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      await artNFT721.mintArtwork(
        artist.address,
        'Artwork 2',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE
      );

      expect(await artNFT721.ownerOf(1)).to.equal(artist.address);
      expect(await artNFT721.ownerOf(2)).to.equal(artist.address);
    });
  });
});
