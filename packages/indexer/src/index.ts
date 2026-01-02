import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Simple event indexer for artwork minting and transfers
 */
export class ArtworkIndexer {
  private client;
  private contractAddress: `0x${string}`;

  constructor(rpcUrl: string, contractAddress: `0x${string}`) {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl),
    });
    this.contractAddress = contractAddress;
  }

  /**
   * Index minting events
   */
  async indexMintEvents(fromBlock: bigint, toBlock: bigint) {
    const mintEventSignature = parseAbiItem(
      'event ArtworkMinted(uint256 indexed tokenId, address indexed artist, string title, bytes32 artworkHash, uint96 royaltyPercentage)'
    );

    const logs = await this.client.getLogs({
      address: this.contractAddress,
      event: mintEventSignature,
      fromBlock,
      toBlock,
    });

    return logs.map((log) => ({
      tokenId: log.args.tokenId?.toString(),
      artist: log.args.artist,
      title: log.args.title,
      artworkHash: log.args.artworkHash,
      royaltyPercentage: log.args.royaltyPercentage,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    }));
  }

  /**
   * Index transfer events
   */
  async indexTransferEvents(fromBlock: bigint, toBlock: bigint) {
    const transferEventSignature = parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
    );

    const logs = await this.client.getLogs({
      address: this.contractAddress,
      event: transferEventSignature,
      fromBlock,
      toBlock,
    });

    return logs.map((log) => ({
      from: log.args.from,
      to: log.args.to,
      tokenId: log.args.tokenId?.toString(),
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    }));
  }

  /**
   * Get current block number
   */
  async getCurrentBlock(): Promise<bigint> {
    return await this.client.getBlockNumber();
  }
}

/**
 * Main indexer service
 */
export async function startIndexer() {
  const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS environment variable is required');
  }

  const indexer = new ArtworkIndexer(rpcUrl, contractAddress);

  console.log('🎨 Artwork Indexer Started');
  console.log(`Monitoring contract: ${contractAddress}`);

  // In production, this would sync to a database
  // For now, just log events
  const currentBlock = await indexer.getCurrentBlock();
  console.log(`Current block: ${currentBlock}`);

  // Index from genesis (or configured start block)
  const startBlock = BigInt(process.env.START_BLOCK || 0);
  
  const mints = await indexer.indexMintEvents(startBlock, currentBlock);
  console.log(`\nFound ${mints.length} mint events:`);
  console.log(JSON.stringify(mints, null, 2));

  const transfers = await indexer.indexTransferEvents(startBlock, currentBlock);
  console.log(`\nFound ${transfers.length} transfer events:`);
  console.log(JSON.stringify(transfers, null, 2));
}

// Run if executed directly
if (require.main === module) {
  startIndexer().catch(console.error);
}
