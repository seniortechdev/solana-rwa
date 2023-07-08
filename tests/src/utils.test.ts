import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import {
  lamportsToSol,
  solToLamports,
  tokenAmountToNumber,
  numberToTokenAmount,
  calculateTokenPrice,
  calculateMarketCap,
  calculateAvailableSupply,
  isValidPublicKey,
  formatNumber,
  formatCurrency,
  truncateAddress,
  getAssetPDA,
  getMintPDA,
} from 'rwa-portal-sdk'

describe('Utils', () => {
  describe('lamportsToSol', () => {
    it('should convert lamports to SOL correctly', () => {
      expect(lamportsToSol(1000000000)).toBe(1) // 1 SOL
      expect(lamportsToSol(500000000)).toBe(0.5) // 0.5 SOL
      expect(lamportsToSol(0)).toBe(0)
    })
  })

  describe('solToLamports', () => {
    it('should convert SOL to lamports correctly', () => {
      expect(solToLamports(1)).toBe(1000000000) // 1 SOL
      expect(solToLamports(0.5)).toBe(500000000) // 0.5 SOL
      expect(solToLamports(0)).toBe(0)
    })
  })

  describe('tokenAmountToNumber', () => {
    it('should convert token amount to number correctly', () => {
      expect(tokenAmountToNumber(new BN(1000000), 6)).toBe(1) // 1 token with 6 decimals
      expect(tokenAmountToNumber(new BN(500000), 6)).toBe(0.5) // 0.5 tokens
      expect(tokenAmountToNumber(new BN(0), 6)).toBe(0)
    })
  })

  describe('numberToTokenAmount', () => {
    it('should convert number to token amount correctly', () => {
      expect(numberToTokenAmount(1, 6).toNumber()).toBe(1000000) // 1 token with 6 decimals
      expect(numberToTokenAmount(0.5, 6).toNumber()).toBe(500000) // 0.5 tokens
      expect(numberToTokenAmount(0, 6).toNumber()).toBe(0)
    })
  })

  describe('calculateTokenPrice', () => {
    it('should calculate token price correctly', () => {
      const valuation = new BN(1000000) // $1M
      const totalSupply = new BN(1000000) // 1M tokens
      
      expect(calculateTokenPrice(valuation, totalSupply)).toBe(1) // $1 per token
    })

    it('should return 0 for zero supply', () => {
      const valuation = new BN(1000000)
      const totalSupply = new BN(0)
      
      expect(calculateTokenPrice(valuation, totalSupply)).toBe(0)
    })
  })

  describe('calculateMarketCap', () => {
    it('should calculate market cap correctly', () => {
      const tokenPrice = 1.5
      const totalSupply = new BN(1000000)
      
      expect(calculateMarketCap(tokenPrice, totalSupply)).toBe(1500000) // $1.5M
    })
  })

  describe('calculateAvailableSupply', () => {
    it('should calculate available supply correctly', () => {
      const totalSupply = new BN(1000000)
      const mintedSupply = new BN(750000)
      
      expect(calculateAvailableSupply(totalSupply, mintedSupply)).toBe(0.25) // 250k tokens
    })
  })

  describe('isValidPublicKey', () => {
    it('should validate public keys correctly', () => {
      expect(isValidPublicKey('11111111111111111111111111111112')).toBe(true)
      expect(isValidPublicKey('invalid-key')).toBe(false)
      expect(isValidPublicKey('')).toBe(false)
    })
  })

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1234.567)).toBe('1,234.57')
      expect(formatNumber(1000000)).toBe('1,000,000.00')
      expect(formatNumber(0)).toBe('0.00')
    })

    it('should format numbers with custom decimals', () => {
      expect(formatNumber(1234.567, 0)).toBe('1,235')
      expect(formatNumber(1234.567, 4)).toBe('1,234.5670')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('truncateAddress', () => {
    it('should truncate addresses correctly', () => {
      const address = '11111111111111111111111111111112'
      expect(truncateAddress(address, 4)).toBe('1111...1112')
      expect(truncateAddress(address, 2)).toBe('11...12')
    })

    it('should not truncate short addresses', () => {
      const shortAddress = '123456789'
      expect(truncateAddress(shortAddress, 4)).toBe(shortAddress)
    })
  })

  describe('getAssetPDA', () => {
    it('should generate asset PDA correctly', () => {
      const owner = new PublicKey('11111111111111111111111111111112')
      const name = 'Test Asset'
      
      const [pda, bump] = getAssetPDA(owner, name)
      
      expect(pda).toBeInstanceOf(PublicKey)
      expect(typeof bump).toBe('number')
    })
  })

  describe('getMintPDA', () => {
    it('should generate mint PDA correctly', () => {
      const asset = new PublicKey('11111111111111111111111111111112')
      
      const [pda, bump] = getMintPDA(asset)
      
      expect(pda).toBeInstanceOf(PublicKey)
      expect(typeof bump).toBe('number')
    })
  })
})
