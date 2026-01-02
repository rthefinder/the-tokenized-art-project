#!/usr/bin/env node
/**
 * Verify Contracts Script
 * 
 * Usage: node scripts/verify-contracts.js --network <network>
 */

const { run } = require('hardhat');

async function main() {
  const contracts = [
    {
      name: 'ArtNFT721',
      address: process.env.ART_NFT_721_ADDRESS,
      constructorArguments: ['Tokenized Art', 'ART721'],
    },
    {
      name: 'ArtNFT1155',
      address: process.env.ART_NFT_1155_ADDRESS,
      constructorArguments: ['https://api.tokenizedart.xyz/metadata/'],
    },
    {
      name: 'ArtToken',
      address: process.env.ART_TOKEN_ADDRESS,
      constructorArguments: [process.env.DEPLOYER_ADDRESS],
    },
    {
      name: 'ArtMarketplace',
      address: process.env.ART_MARKETPLACE_ADDRESS,
      constructorArguments: [process.env.FEE_RECIPIENT_ADDRESS],
    },
  ];

  for (const contract of contracts) {
    if (!contract.address) {
      console.log(`⚠️  Skipping ${contract.name} - no address provided`);
      continue;
    }

    console.log(`\nVerifying ${contract.name} at ${contract.address}...`);

    try {
      await run('verify:verify', {
        address: contract.address,
        constructorArguments: contract.constructorArguments,
      });
      console.log(`✅ ${contract.name} verified successfully`);
    } catch (error) {
      if (error.message.includes('Already Verified')) {
        console.log(`✅ ${contract.name} already verified`);
      } else {
        console.error(`❌ Error verifying ${contract.name}:`, error.message);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
