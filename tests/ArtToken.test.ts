import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ArtToken } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('ArtToken', function () {
  let artToken: ArtToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseEther('1000000000'); // 1 billion

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ArtTokenFactory = await ethers.getContractFactory('ArtToken');
    artToken = await ArtTokenFactory.deploy(owner.address);
    await artToken.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the correct name and symbol', async function () {
      expect(await artToken.name()).to.equal('Art Token');
      expect(await artToken.symbol()).to.equal('ART');
    });

    it('Should mint initial supply to owner', async function () {
      expect(await artToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it('Should set correct total supply', async function () {
      expect(await artToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it('Should have correct max supply', async function () {
      expect(await artToken.maxSupply()).to.equal(INITIAL_SUPPLY);
    });

    it('Should report at max supply', async function () {
      expect(await artToken.atMaxSupply()).to.be.true;
    });
  });

  describe('Transfers', function () {
    it('Should transfer tokens between accounts', async function () {
      const amount = ethers.parseEther('100');
      await artToken.transfer(addr1.address, amount);
      expect(await artToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it('Should fail if sender does not have enough tokens', async function () {
      const initialBalance = await artToken.balanceOf(owner.address);
      await expect(
        artToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(artToken, 'ERC20InsufficientBalance');
    });
  });

  describe('Burning', function () {
    it('Should allow token burning', async function () {
      const burnAmount = ethers.parseEther('1000');
      await artToken.burn(burnAmount);

      expect(await artToken.totalSupply()).to.equal(INITIAL_SUPPLY - burnAmount);
      expect(await artToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - burnAmount);
    });

    it('Should update atMaxSupply after burning', async function () {
      await artToken.burn(ethers.parseEther('1'));
      expect(await artToken.atMaxSupply()).to.be.false;
    });
  });

  describe('EIP-2612 Permit', function () {
    it('Should support permit functionality', async function () {
      // Just verify the domain separator exists
      const domain = await artToken.eip712Domain();
      expect(domain.name).to.equal('Art Token');
    });
  });

  describe('Ownership', function () {
    it('Should set the correct owner', async function () {
      expect(await artToken.owner()).to.equal(owner.address);
    });
  });
});
