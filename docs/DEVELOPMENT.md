# Development Guide

## Setup

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8
- Git

### Quick Start

```bash
# Clone and setup
git clone https://github.com/rthefinder/the-tokenized-art-project.git
cd the-tokenized-art-project
./scripts/setup-dev.sh

# Start local blockchain
cd contracts && npx hardhat node

# Deploy contracts (new terminal)
cd contracts && pnpm deploy:localhost

# Start web app (new terminal)
cd apps/web && pnpm dev

# Start indexer (new terminal)
cd packages/indexer && pnpm dev
```

## Project Structure

- `/apps/web` - Next.js frontend application
- `/contracts` - Solidity smart contracts + Hardhat
- `/packages/shared` - Shared TypeScript types and utilities
- `/packages/indexer` - Event indexing service
- `/tests` - Smart contract tests
- `/scripts` - Helper scripts
- `/docs` - Documentation

## Development Workflow

### Making Changes

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Run tests and linter
5. Submit PR

### Testing

```bash
# Test contracts
cd contracts && pnpm test

# Test with coverage
cd contracts && pnpm test:coverage

# Lint all code
pnpm lint

# Format code
pnpm format
```

### Contract Development

1. Write contract in `/contracts/contracts/`
2. Add tests in `/tests/`
3. Run `pnpm compile`
4. Run `pnpm test`
5. Check gas usage: `REPORT_GAS=true pnpm test`

### Frontend Development

1. Start dev server: `cd apps/web && pnpm dev`
2. Make changes in `/apps/web/src/`
3. Components go in `/components/`
4. Pages go in `/app/`
5. Hot reload automatically

### Adding Dependencies

```bash
# Root dependency
pnpm add -w <package>

# Workspace dependency
pnpm add <package> --filter @art/web
```

## Environment Variables

### Contracts
```
SEPOLIA_RPC_URL=https://...
MAINNET_RPC_URL=https://...
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

### Web App
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_ART_NFT_721_ADDRESS=0x...
NEXT_PUBLIC_ART_NFT_1155_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
```

### Indexer
```
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x...
START_BLOCK=0
```

## Debugging

### Contract Debugging
```bash
# Console.log in Solidity
import "hardhat/console.sol";
console.log("Debug:", value);

# Run specific test
npx hardhat test tests/ArtNFT721.test.ts
```

### Frontend Debugging
- Use React DevTools
- Check browser console
- Use wagmi hooks debugging

## Common Tasks

### Deploy New Contract
1. Add contract to `/contracts/contracts/`
2. Update deployment script
3. Deploy: `pnpm deploy:localhost`
4. Update frontend with address

### Add New Page
1. Create file in `/apps/web/src/app/[page]/page.tsx`
2. Add to navigation in `header.tsx`
3. Style with Tailwind

### Update Shared Types
1. Edit `/packages/shared/src/schemas.ts`
2. Run `pnpm --filter @art/shared build`
3. Changes available in apps

## Performance

### Contract Optimization
- Use `calldata` for read-only parameters
- Batch operations when possible
- Minimize storage writes
- Use events for indexing

### Frontend Optimization
- Use Next.js Image component
- Implement lazy loading
- Minimize bundle size
- Cache API calls

## Security

### Smart Contracts
- Always use `nonReentrant` on payable functions
- Validate all inputs
- Use OpenZeppelin libraries
- Add comprehensive tests
- Consider formal verification

### Frontend
- Never expose private keys
- Validate user input
- Use environment variables
- Implement CSP headers

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Deploy contracts (if needed)
5. Deploy frontend
6. Announce release

## Getting Help

- Check [docs/](docs/)
- Search existing issues
- Ask in Discord
- Open a discussion on GitHub

Happy coding! 🎨
