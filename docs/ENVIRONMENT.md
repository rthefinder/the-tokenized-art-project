# Environment Variables

## Contracts (.env)

```bash
# Network RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Deployer Private Key (DO NOT COMMIT)
PRIVATE_KEY=0x...

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY

# CoinMarketCap API Key (for gas reporting)
COINMARKETCAP_API_KEY=YOUR_CMC_KEY

# Gas Reporting
REPORT_GAS=false
```

## Web App (.env.local)

```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=1  # 1 for mainnet, 11155111 for Sepolia

# Contract Addresses (update after deployment)
NEXT_PUBLIC_ART_NFT_721_ADDRESS=0x...
NEXT_PUBLIC_ART_NFT_1155_ADDRESS=0x...
NEXT_PUBLIC_ART_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

## Indexer (.env)

```bash
# RPC URL for blockchain connection
RPC_URL=http://localhost:8545

# Contract address to index
CONTRACT_ADDRESS=0x...

# Starting block number (0 for genesis)
START_BLOCK=0

# Polling interval in milliseconds
POLL_INTERVAL=12000

# Database (optional, for production)
DATABASE_URL=postgresql://...
```

## GitHub Actions Secrets

Set these in your GitHub repository settings:

### Contract Deployment
- `DEPLOYER_PRIVATE_KEY` - Private key for contract deployment
- `SEPOLIA_RPC_URL` - Sepolia RPC endpoint
- `MAINNET_RPC_URL` - Mainnet RPC endpoint
- `ETHERSCAN_API_KEY` - For contract verification
- `FEE_RECIPIENT_ADDRESS` - Address to receive platform fees

### Web Deployment
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- Contract addresses (after deployment)

## Security Notes

⚠️ **NEVER commit sensitive keys to version control**

- Add `.env` files to `.gitignore` (already done)
- Use environment-specific `.env` files
- Rotate keys regularly
- Use different keys for testnet and mainnet
- Consider using a secrets management service for production

## Getting API Keys

### Alchemy (RPC Provider)
1. Visit https://www.alchemy.com/
2. Create account and new app
3. Copy API key from dashboard

### Etherscan (Contract Verification)
1. Visit https://etherscan.io/
2. Register and login
3. Go to API Keys section
4. Generate new key

### WalletConnect (Wallet Connection)
1. Visit https://cloud.walletconnect.com/
2. Create new project
3. Copy project ID

### CoinMarketCap (Gas Reporting)
1. Visit https://coinmarketcap.com/api/
2. Sign up for free plan
3. Generate API key
