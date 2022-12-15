# Solana RWA Portal

A comprehensive platform for tokenizing Real World Assets (RWA) on Solana blockchain, enabling fractional ownership and trading of physical assets through SPL tokens.

## 🏗️ Tech Stack

- **Blockchain**: Solana + Anchor Framework (Rust)
- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **Wallet Integration**: Solana Wallet Adapter
- **Metadata Storage**: On-chain + Arweave/IPFS
- **Testing**: Anchor Rust tests + Jest TypeScript tests

## 📁 Project Structure

```
solana-rwa-portal/
├── programs/        # Anchor smart contracts
│   └── rwa_token/   # Core RWA tokenization program
├── app/             # Next.js frontend
├── sdk/             # TypeScript SDK for contract interaction
├── tests/           # Anchor + TS integration tests
└── docs/            # Documentation + diagrams
```

## 🚀 Features

- **Asset Tokenization**: Register and tokenize real-world assets
- **Fractional Ownership**: Split assets into tradeable SPL tokens
- **Marketplace**: Buy/sell fractional shares with USDC
- **Metadata Management**: On-chain and off-chain asset information
- **Portfolio Dashboard**: Track owned fractions and transaction history
- **Multi-wallet Support**: Phantom, Solflare, Backpack integration

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and Yarn
- Rust and Solana CLI
- Anchor Framework

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/solana-rwa-portal.git
   cd solana-rwa-portal
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd app && yarn install

   # Install SDK dependencies
   cd ../sdk && yarn install

   # Install Anchor dependencies
   cd ../programs/rwa_token && anchor build
   ```

3. **Start local development**
   ```bash
   # Start Solana localnet
   solana-test-validator

   # Deploy contracts (in another terminal)
   cd programs/rwa_token && anchor deploy

   # Start frontend (in another terminal)
   cd app && yarn dev
   ```

## 🧪 Testing

```bash
# Run Anchor tests
cd programs/rwa_token && anchor test

# Run TypeScript tests
cd tests && yarn test
```

## 📖 Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [SPL Token Program](https://spl.solana.com/token)
