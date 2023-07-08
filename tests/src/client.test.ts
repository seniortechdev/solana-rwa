import { Connection, PublicKey } from '@solana/web3.js'
import { Wallet } from '@coral-xyz/anchor'
import { RWAPortalClient } from 'rwa-portal-sdk'

describe('RWAPortalClient', () => {
  let client: RWAPortalClient
  let mockConnection: Connection
  let mockWallet: Wallet

  beforeEach(() => {
    mockConnection = new Connection('http://localhost:8899')
    mockWallet = {
      publicKey: new PublicKey('mock-public-key'),
      signTransaction: jest.fn(),
      signAllTransactions: jest.fn(),
    } as any

    client = new RWAPortalClient(mockConnection, mockWallet, 'devnet')
  })

  describe('createAsset', () => {
    it('should create a new asset successfully', async () => {
      const params = {
        name: 'Test Asset',
        description: 'Test Description',
        valuation: 1000000,
        assetType: 'RealEstate' as any,
        metadataUri: 'https://example.com/metadata',
        totalSupply: 1000000,
      }

      const result = await client.createAsset(params)

      expect(result.success).toBe(true)
      expect(result.signature).toBe('mock-signature')
    })

    it('should handle errors gracefully', async () => {
      // Mock the program to throw an error
      const mockProgram = (client as any).program
      mockProgram.methods.initializeAsset.mockImplementation(() => {
        throw new Error('Test error')
      })

      const params = {
        name: 'Test Asset',
        description: 'Test Description',
        valuation: 1000000,
        assetType: 'RealEstate' as any,
        metadataUri: 'https://example.com/metadata',
        totalSupply: 1000000,
      }

      const result = await client.createAsset(params)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Test error')
    })
  })

  describe('mintTokens', () => {
    it('should mint tokens successfully', async () => {
      const params = {
        assetAddress: new PublicKey('mock-asset-address'),
        amount: 1000,
      }

      const result = await client.mintTokens(params)

      expect(result.success).toBe(true)
      expect(result.signature).toBe('mock-signature')
    })
  })

  describe('buyFraction', () => {
    it('should buy fraction successfully', async () => {
      const params = {
        assetAddress: new PublicKey('mock-asset-address'),
        usdcAmount: 100,
        expectedTokens: 100,
      }

      const result = await client.buyFraction(params)

      expect(result.success).toBe(true)
      expect(result.signature).toBe('mock-signature')
    })
  })

  describe('getAsset', () => {
    it('should fetch asset successfully', async () => {
      const assetAddress = new PublicKey('mock-asset-address')
      const asset = await client.getAsset(assetAddress)

      expect(asset).toBeDefined()
      expect(asset?.name).toBe('Test Asset')
      expect(asset?.description).toBe('Test Description')
      expect(asset?.valuation.toNumber()).toBe(1000000)
    })

    it('should return null for non-existent asset', async () => {
      const mockProgram = (client as any).program
      mockProgram.account.asset.fetch.mockRejectedValue(new Error('Account not found'))

      const assetAddress = new PublicKey('non-existent-address')
      const asset = await client.getAsset(assetAddress)

      expect(asset).toBeNull()
    })
  })

  describe('getWalletBalance', () => {
    it('should fetch wallet balance successfully', async () => {
      const publicKey = new PublicKey('mock-public-key')
      const balance = await client.getWalletBalance(publicKey)

      expect(balance).toBeDefined()
      expect(balance.sol).toBe(1) // 1 SOL in lamports converted
      expect(balance.usdc).toBe(1) // Mock USDC balance
      expect(balance.tokens).toEqual({})
    })
  })
})
