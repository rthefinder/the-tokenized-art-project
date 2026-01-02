#!/usr/bin/env node
/**
 * Mint Artwork Script
 * 
 * Usage: node scripts/mint-artwork.js --network <network> --type <721|1155>
 */

const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('Minting artwork with account:', signer.address);

  // Example artwork metadata
  const metadata = {
    title: 'Sunset Dreams',
    medium: 'Digital Art',
    description: 'A beautiful digital sunset',
    creationDate: Math.floor(Date.now() / 1000),
    artworkHash: ethers.keccak256(ethers.toUtf8Bytes('artwork-data')),
    tokenURI: 'ipfs://QmExample123',
    royaltyPercentage: 500, // 5%
  };

  // Get contract address from env or deployment
  const contractAddress = process.env.ART_NFT_721_ADDRESS;
  if (!contractAddress) {
    console.error('Please set ART_NFT_721_ADDRESS environment variable');
    process.exit(1);
  }

  const ArtNFT721 = await ethers.getContractFactory('ArtNFT721');
  const contract = ArtNFT721.attach(contractAddress);

  console.log('\nMinting artwork...');
  const tx = await contract.mintArtwork(
    signer.address,
    metadata.title,
    metadata.medium,
    metadata.creationDate,
    metadata.artworkHash,
    metadata.tokenURI,
    metadata.royaltyPercentage
  );

  console.log('Transaction hash:', tx.hash);
  const receipt = await tx.wait();
  console.log('✅ Artwork minted successfully!');
  console.log('Block number:', receipt.blockNumber);

  // Extract token ID from events
  const event = receipt.logs.find((log) => {
    try {
      return contract.interface.parseLog(log).name === 'ArtworkMinted';
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = contract.interface.parseLog(event);
    console.log('Token ID:', parsed.args.tokenId.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
