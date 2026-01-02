import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying $ART contracts...');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // Deploy ArtNFT721
  console.log('\n1. Deploying ArtNFT721...');
  const ArtNFT721 = await ethers.getContractFactory('ArtNFT721');
  const artNFT721 = await ArtNFT721.deploy('Tokenized Art', 'ART721');
  await artNFT721.waitForDeployment();
  const art721Address = await artNFT721.getAddress();
  console.log('ArtNFT721 deployed to:', art721Address);

  // Deploy ArtNFT1155
  console.log('\n2. Deploying ArtNFT1155...');
  const ArtNFT1155 = await ethers.getContractFactory('ArtNFT1155');
  const artNFT1155 = await ArtNFT1155.deploy('https://api.tokenizedart.xyz/metadata/');
  await artNFT1155.waitForDeployment();
  const art1155Address = await artNFT1155.getAddress();
  console.log('ArtNFT1155 deployed to:', art1155Address);

  // Deploy ArtToken
  console.log('\n3. Deploying ArtToken...');
  const ArtToken = await ethers.getContractFactory('ArtToken');
  const artToken = await ArtToken.deploy(deployer.address);
  await artToken.waitForDeployment();
  const tokenAddress = await artToken.getAddress();
  console.log('ArtToken deployed to:', tokenAddress);

  // Deploy ArtMarketplace
  console.log('\n4. Deploying ArtMarketplace...');
  const ArtMarketplace = await ethers.getContractFactory('ArtMarketplace');
  const marketplace = await ArtMarketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log('ArtMarketplace deployed to:', marketplaceAddress);

  console.log('\n=== Deployment Summary ===');
  console.log('ArtNFT721:', art721Address);
  console.log('ArtNFT1155:', art1155Address);
  console.log('ArtToken:', tokenAddress);
  console.log('ArtMarketplace:', marketplaceAddress);

  console.log('\n=== Save these addresses to your .env file ===');
  console.log(`ART_NFT_721_ADDRESS=${art721Address}`);
  console.log(`ART_NFT_1155_ADDRESS=${art1155Address}`);
  console.log(`ART_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`ART_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
