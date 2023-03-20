import { PublicKey } from '@solana/web3.js';

// Program ID
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// USDC Mint Address (mainnet)
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// USDC Mint Address (devnet/testnet)
export const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Network configurations
export const NETWORKS = {
  mainnet: {
    name: 'Mainnet',
    url: 'https://api.mainnet-beta.solana.com',
    usdcMint: USDC_MINT,
  },
  devnet: {
    name: 'Devnet',
    url: 'https://api.devnet.solana.com',
    usdcMint: USDC_MINT_DEVNET,
  },
  localnet: {
    name: 'Localnet',
    url: 'http://127.0.0.1:8899',
    usdcMint: USDC_MINT_DEVNET, // Use devnet USDC for local testing
  },
} as const;

// Default network
export const DEFAULT_NETWORK = 'devnet' as keyof typeof NETWORKS;

// Token decimals
export const TOKEN_DECIMALS = 6;
export const SOL_DECIMALS = 9;

// Transaction confirmation options
export const CONFIRMATION_OPTIONS = {
  commitment: 'confirmed' as const,
  preflightCommitment: 'processed' as const,
  maxRetries: 3,
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  TRANSACTION_FAILED: 'Transaction failed',
  ASSET_NOT_FOUND: 'Asset not found',
  UNAUTHORIZED: 'Unauthorized access',
  NETWORK_ERROR: 'Network error',
} as const;

// RPC endpoints
export const RPC_ENDPOINTS = {
  mainnet: [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
  ],
  devnet: [
    'https://api.devnet.solana.com',
  ],
  localnet: [
    'http://127.0.0.1:8899',
  ],
} as const;
