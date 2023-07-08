import { Connection, PublicKey } from '@solana/web3.js'

// Mock Solana connection for testing
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn().mockImplementation(() => ({
    getBalance: jest.fn().mockResolvedValue(1000000000), // 1 SOL in lamports
    getAccountInfo: jest.fn().mockResolvedValue(null),
    sendTransaction: jest.fn().mockResolvedValue('mock-signature'),
  })),
  PublicKey: jest.fn().mockImplementation((key) => ({
    toBase58: () => key || 'mock-public-key',
    toString: () => key || 'mock-public-key',
  })),
  Transaction: jest.fn(),
  SystemProgram: {
    transfer: jest.fn(),
  },
  clusterApiUrl: jest.fn().mockReturnValue('http://localhost:8899'),
}))

// Mock Anchor
jest.mock('@coral-xyz/anchor', () => ({
  Program: jest.fn().mockImplementation(() => ({
    methods: {
      initializeAsset: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          rpc: jest.fn().mockResolvedValue('mock-signature'),
        }),
      }),
      mintFractionalTokens: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          rpc: jest.fn().mockResolvedValue('mock-signature'),
        }),
      }),
    },
    account: {
      asset: {
        fetch: jest.fn().mockResolvedValue({
          owner: 'mock-owner',
          name: 'Test Asset',
          description: 'Test Description',
          valuation: 1000000,
          assetType: 'RealEstate',
          metadataUri: 'https://example.com/metadata',
          totalSupply: 1000000,
          mintedSupply: 0,
          createdAt: Date.now(),
          lastMintAt: 0,
          lastRedeemAt: 0,
          isActive: true,
        }),
        all: jest.fn().mockResolvedValue([]),
      },
    },
  })),
  AnchorProvider: jest.fn(),
  Wallet: jest.fn(),
  BN: jest.fn().mockImplementation((value) => ({
    toNumber: () => value,
    toString: () => value.toString(),
    isZero: () => value === 0,
    sub: jest.fn().mockReturnThis(),
  })),
}))

// Mock SPL Token
jest.mock('@solana/spl-token', () => ({
  getAssociatedTokenAddress: jest.fn().mockResolvedValue('mock-token-address'),
  getAccount: jest.fn().mockResolvedValue({
    amount: 1000000,
  }),
  createAssociatedTokenAccountInstruction: jest.fn(),
  TOKEN_PROGRAM_ID: 'mock-token-program-id',
}))

// Global test timeout
jest.setTimeout(30000)
