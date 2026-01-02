import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ArtNFT1155 } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('ArtNFT1155', function () {
  let artNFT1155: ArtNFT1155;
  let owner: SignerWithAddress;
  let artist: SignerWithAddress;
  let collector1: SignerWithAddress;
  let collector2: SignerWithAddress;

  const ARTWORK_HASH = ethers.keccak256(ethers.toUtf8Bytes('edition-artwork'));
  const TOKEN_URI = 'ipfs://QmEdition123';
  const ROYALTY_PERCENTAGE = 500; // 5%
  const MAX_SUPPLY = 100;

  beforeEach(async function () {
    [owner, artist, collector1, collector2] = await ethers.getSigners();

    const ArtNFT1155Factory = await ethers.getContractFactory('ArtNFT1155');
    artNFT1155 = await ArtNFT1155Factory.deploy('https://api.tokenizedart.xyz/metadata/');
    await artNFT1155.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should deploy successfully', async function () {
      expect(await artNFT1155.getAddress()).to.be.properAddress;
    });

    it('Should set the correct owner', async function () {
      expect(await artNFT1155.owner()).to.equal(owner.address);
    });
  });

  describe('Edition Creation', function () {
    it('Should create edition successfully', async function () {
      const tx = await artNFT1155.createEdition(
        artist.address,
        'Limited Edition Print',
        'Digital Print',
        Math.floor(Date.now() / 1000),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );

      await expect(tx)
        .to.emit(artNFT1155, 'EditionCreated')
        .withArgs(1, artist.address, 'Limited Edition Print', MAX_SUPPLY, ARTWORK_HASH, ROYALTY_PERCENTAGE);

      expect(await artNFT1155.totalEditions()).to.equal(1);
    });

    it('Should store edition metadata correctly', async function () {
      const creationDate = Math.floor(Date.now() / 1000);
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        creationDate,
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );

      const metadata = await artNFT1155.getEditionMetadata(1);
      expect(metadata.artist).to.equal(artist.address);
      expect(metadata.title).to.equal('Test Edition');
      expect(metadata.medium).to.equal('Digital');
      expect(metadata.creationDate).to.equal(creationDate);
      expect(metadata.artworkHash).to.equal(ARTWORK_HASH);
      expect(metadata.royaltyPercentage).to.equal(ROYALTY_PERCENTAGE);
      expect(metadata.maxSupply).to.equal(MAX_SUPPLY);
      expect(metadata.currentSupply).to.equal(0);
    });

    it('Should revert if artist address is invalid', async function () {
      await expect(
        artNFT1155.createEdition(
          ethers.ZeroAddress,
          'Test',
          'Digital',
          Date.now(),
          ARTWORK_HASH,
          TOKEN_URI,
          ROYALTY_PERCENTAGE,
          MAX_SUPPLY
        )
      ).to.be.revertedWith('Invalid artist address');
    });

    it('Should revert if max supply is zero', async function () {
      await expect(
        artNFT1155.createEdition(
          artist.address,
          'Test',
          'Digital',
          Date.now(),
          ARTWORK_HASH,
          TOKEN_URI,
          ROYALTY_PERCENTAGE,
          0
        )
      ).to.be.revertedWith('Max supply must be greater than 0');
    });
  });

  describe('Edition Minting', function () {
    beforeEach(async function () {
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );
    });

    it('Should mint editions successfully', async function () {
      await expect(artNFT1155.mintEdition(collector1.address, 1, 10))
        .to.emit(artNFT1155, 'EditionMinted')
        .withArgs(1, collector1.address, 10);

      expect(await artNFT1155.balanceOf(collector1.address, 1)).to.equal(10);
    });

    it('Should update current supply', async function () {
      await artNFT1155.mintEdition(collector1.address, 1, 10);

      const metadata = await artNFT1155.getEditionMetadata(1);
      expect(metadata.currentSupply).to.equal(10);
    });

    it('Should revert if exceeds max supply', async function () {
      await expect(
        artNFT1155.mintEdition(collector1.address, 1, MAX_SUPPLY + 1)
      ).to.be.revertedWith('Exceeds max supply');
    });

    it('Should allow multiple mints up to max supply', async function () {
      await artNFT1155.mintEdition(collector1.address, 1, 50);
      await artNFT1155.mintEdition(collector2.address, 1, 50);

      const metadata = await artNFT1155.getEditionMetadata(1);
      expect(metadata.currentSupply).to.equal(MAX_SUPPLY);

      await expect(
        artNFT1155.mintEdition(collector1.address, 1, 1)
      ).to.be.revertedWith('Exceeds max supply');
    });

    it('Should revert if recipient address is invalid', async function () {
      await expect(
        artNFT1155.mintEdition(ethers.ZeroAddress, 1, 10)
      ).to.be.revertedWith('Invalid recipient address');
    });

    it('Should revert if amount is zero', async function () {
      await expect(
        artNFT1155.mintEdition(collector1.address, 1, 0)
      ).to.be.revertedWith('Amount must be greater than 0');
    });
  });

  describe('Supply Management', function () {
    beforeEach(async function () {
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );
    });

    it('Should report correct remaining supply', async function () {
      expect(await artNFT1155.remainingSupply(1)).to.equal(MAX_SUPPLY);

      await artNFT1155.mintEdition(collector1.address, 1, 30);
      expect(await artNFT1155.remainingSupply(1)).to.equal(70);
    });

    it('Should report if more can be minted', async function () {
      expect(await artNFT1155.canMintMore(1)).to.be.true;

      await artNFT1155.mintEdition(collector1.address, 1, MAX_SUPPLY);
      expect(await artNFT1155.canMintMore(1)).to.be.false;
    });
  });

  describe('Royalties (EIP-2981)', function () {
    beforeEach(async function () {
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );
    });

    it('Should return correct royalty info', async function () {
      const salePrice = ethers.parseEther('1');
      const [recipient, amount] = await artNFT1155.royaltyInfo(1, salePrice);

      expect(recipient).to.equal(artist.address);
      expect(amount).to.equal(salePrice * BigInt(ROYALTY_PERCENTAGE) / BigInt(10000));
    });

    it('Should support EIP-2981 interface', async function () {
      const EIP2981_INTERFACE_ID = '0x2a55205a';
      expect(await artNFT1155.supportsInterface(EIP2981_INTERFACE_ID)).to.be.true;
    });
  });

  describe('Transfers', function () {
    beforeEach(async function () {
      await artNFT1155.createEdition(
        artist.address,
        'Test Edition',
        'Digital',
        Date.now(),
        ARTWORK_HASH,
        TOKEN_URI,
        ROYALTY_PERCENTAGE,
        MAX_SUPPLY
      );
      await artNFT1155.mintEdition(collector1.address, 1, 10);
    });

    it('Should transfer editions successfully', async function () {
      await artNFT1155.connect(collector1).safeTransferFrom(
        collector1.address,
        collector2.address,
        1,
        5,
        '0x'
      );

      expect(await artNFT1155.balanceOf(collector1.address, 1)).to.equal(5);
      expect(await artNFT1155.balanceOf(collector2.address, 1)).to.equal(5);
    });
  });
});
