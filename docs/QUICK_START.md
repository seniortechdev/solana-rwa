# Quick Start Guide

Get up and running with the Solana RWA Portal in minutes!

## Prerequisites

- Node.js 18+
- Yarn
- Rust
- Solana CLI
- Anchor Framework

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/solana-rwa-portal.git
cd solana-rwa-portal

# Run the setup script
./scripts/setup.sh
```

## Development

### 1. Start Solana Test Validator

```bash
solana-test-validator --reset
```

### 2. Deploy Smart Contract

```bash
yarn anchor:deploy
```

### 3. Start Frontend

```bash
yarn dev
```

Visit `http://localhost:3000` to see the application!

## Usage

### Creating an Asset

1. Connect your wallet
2. Click "Create Asset" on the assets page
3. Fill in asset details:
   - Name and description
   - Asset type (Real Estate, Art, Carbon Credits, etc.)
   - Total valuation in USDC
   - Token supply
   - Upload an image
4. Submit the transaction

### Buying Fractions

1. Browse available assets
2. Click "Buy Fraction" on any asset
3. Enter the number of tokens to purchase
4. Confirm the transaction

### Viewing Portfolio

1. Go to the Dashboard
2. View your owned assets
3. Track transaction history
4. Monitor portfolio value

## Features

- ✅ Asset tokenization
- ✅ Fractional ownership
- ✅ USDC payments
- ✅ Multi-wallet support
- ✅ Real-time portfolio tracking
- ✅ Responsive design
- ✅ TypeScript SDK
- ✅ Comprehensive testing

## Architecture

```
Frontend (Next.js) → SDK (TypeScript) → Smart Contract (Anchor) → Solana
```

## Support

- 📖 [Developer Guide](DEVELOPER_GUIDE.md)
- 🏗️ [Architecture Overview](architecture.md)
- 🐛 [Report Issues](https://github.com/your-username/solana-rwa-portal/issues)
- 💬 [Join Discord](https://discord.gg/your-discord)

## License

MIT License - see [LICENSE](../LICENSE) for details.
