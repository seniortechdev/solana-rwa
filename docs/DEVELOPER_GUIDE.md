# Developer Guide

This guide will help you set up, develop, and deploy the Solana RWA Portal project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** package manager
- **Rust** (latest stable version)
- **Solana CLI** (v1.17 or higher)
- **Anchor Framework** (v0.29 or higher)

### Installation Commands

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify installations
solana --version
anchor --version
```

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/solana-rwa-portal.git
cd solana-rwa-portal

# Install dependencies for all workspaces
yarn install

# Build the Anchor program
yarn anchor:build
```

### 2. Configure Solana CLI

```bash
# Set to localnet for development
solana config set --url localhost

# Create a new keypair if you don't have one
solana-keygen new --outfile ~/.config/solana/id.json

# Check your balance (should be 0 initially)
solana balance
```

### 3. Start Local Development Environment

```bash
# Terminal 1: Start Solana test validator
solana-test-validator --reset

# Terminal 2: Deploy the program
yarn anchor:deploy

# Terminal 3: Start the frontend
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
solana-rwa-portal/
├── programs/
│   └── rwa_token/           # Anchor smart contract
│       ├── src/
│       │   └── lib.rs       # Main program logic
│       └── Cargo.toml       # Rust dependencies
├── app/                     # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js 13+ app directory
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Custom hooks
│   └── package.json
├── sdk/                     # TypeScript SDK
│   ├── src/
│   │   ├── client.ts       # Main client class
│   │   ├── types.ts        # TypeScript types
│   │   ├── utils.ts        # Utility functions
│   │   └── constants.ts    # Constants and configs
│   └── package.json
├── tests/                   # Integration tests
│   ├── src/
│   │   ├── client.test.ts  # SDK tests
│   │   └── utils.test.ts   # Utility tests
│   └── package.json
└── docs/                    # Documentation
    ├── DEVELOPER_GUIDE.md
    └── architecture.md
```

## Smart Contract Development

### Program Architecture

The RWA tokenization program implements the following core functions:

1. **`initialize_asset`** - Create a new tokenized asset
2. **`mint_fractional_tokens`** - Mint fractional ownership tokens
3. **`transfer_fractional_tokens`** - Transfer tokens between users
4. **`buy_fraction`** - Purchase fractional ownership with USDC
5. **`redeem`** - Burn tokens to claim ownership

### Key Concepts

- **Asset Account**: Stores metadata and state for each tokenized asset
- **Mint Account**: SPL token mint for fractional ownership
- **PDA (Program Derived Address)**: Deterministic addresses for asset and mint accounts
- **Authority**: Asset owner who can mint tokens and manage the asset

### Testing the Program

```bash
# Run Anchor tests
cd programs/rwa_token
anchor test

# Run specific test
anchor test -- --grep "initialize_asset"
```

### Program Deployment

```bash
# Deploy to localnet
anchor deploy

# Deploy to devnet
solana config set --url devnet
anchor deploy

# Deploy to mainnet (production)
solana config set --url mainnet-beta
anchor deploy
```

## Frontend Development

### Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Solana Wallet Adapter** - Wallet integration
- **React Hot Toast** - Notifications

### Key Components

- **WalletProvider** - Manages wallet connection state
- **AssetCard** - Displays asset information
- **CreateAssetModal** - Form for creating new assets
- **BuyFractionModal** - Interface for purchasing fractions

### Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Type checking
yarn type-check
```

### Environment Variables

Create a `.env.local` file in the `app` directory:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

## SDK Development

### Client Usage

```typescript
import { RWAPortalClient } from 'rwa-portal-sdk'
import { Connection, Wallet } from '@solana/web3.js'

// Initialize client
const connection = new Connection('http://localhost:8899')
const client = new RWAPortalClient(connection, wallet, 'localnet')

// Create an asset
const result = await client.createAsset({
  name: 'My Asset',
  description: 'Asset description',
  valuation: 1000000, // $1M in USDC
  assetType: 'RealEstate',
  metadataUri: 'https://arweave.net/...',
  totalSupply: 1000000 // 1M tokens
})

// Buy fractional ownership
const buyResult = await client.buyFraction({
  assetAddress: assetPDA,
  usdcAmount: 100, // $100 USDC
  expectedTokens: 100 // 100 tokens
})
```

### Testing the SDK

```bash
# Run SDK tests
cd tests
yarn test

# Run with coverage
yarn test:coverage

# Run in watch mode
yarn test:watch
```

## Testing Strategy

### Unit Tests

- **SDK Tests**: Test client methods and utility functions
- **Component Tests**: Test React components (using React Testing Library)
- **Utility Tests**: Test helper functions and calculations

### Integration Tests

- **End-to-End Tests**: Test complete user flows
- **Contract Tests**: Test smart contract interactions
- **API Tests**: Test external service integrations

### Running Tests

```bash
# Run all tests
yarn test

# Run specific test suite
yarn test:unit
yarn test:integration
yarn test:e2e

# Run tests with coverage
yarn test:coverage
```

## Deployment

### Local Development

1. Start Solana test validator
2. Deploy contracts
3. Start frontend development server
4. Access at `http://localhost:3000`

### Staging (Devnet)

1. Configure Solana CLI for devnet
2. Deploy contracts to devnet
3. Update environment variables
4. Deploy frontend to staging environment

### Production (Mainnet)

1. Configure Solana CLI for mainnet
2. Deploy contracts to mainnet
3. Update environment variables
4. Deploy frontend to production

## Troubleshooting

### Common Issues

1. **Program deployment fails**
   - Check Solana CLI configuration
   - Ensure sufficient SOL balance
   - Verify program ID in Anchor.toml

2. **Frontend can't connect to wallet**
   - Check wallet adapter configuration
   - Verify network settings
   - Ensure wallet is unlocked

3. **Transactions fail**
   - Check account balances
   - Verify program state
   - Check transaction logs

### Debug Commands

```bash
# Check Solana configuration
solana config get

# Check account balance
solana balance

# Check program account
solana account <PROGRAM_ID>

# View transaction logs
solana logs

# Check validator status
solana validators
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Run the test suite
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive tests
- Document public APIs
- Use conventional commit messages

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add changelog entry
4. Request review from maintainers
5. Address feedback
6. Merge after approval

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## Support

For questions and support:

- Create an issue on GitHub
- Join our Discord community
- Check the documentation
- Review existing issues and discussions
