import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import BN from 'bn.js';
import { TOKEN_DECIMALS, SOL_DECIMALS, USDC_MINT, USDC_MINT_DEVNET } from './constants';

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Convert token amount to human readable format
 */
export function tokenAmountToNumber(amount: BN, decimals: number = TOKEN_DECIMALS): number {
  return amount.toNumber() / Math.pow(10, decimals);
}

/**
 * Convert human readable amount to token amount
 */
export function numberToTokenAmount(amount: number, decimals: number = TOKEN_DECIMALS): BN {
  return new BN(Math.floor(amount * Math.pow(10, decimals)));
}

/**
 * Get associated token address for a mint and owner
 */
export async function getTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return await getAssociatedTokenAddress(mint, owner);
}

/**
 * Get USDC token address for a given network
 */
export function getUsdcMint(network: 'mainnet' | 'devnet' | 'localnet'): PublicKey {
  return network === 'mainnet' ? USDC_MINT : USDC_MINT_DEVNET;
}

/**
 * Get token balance for a given account
 */
export async function getTokenBalance(
  connection: Connection,
  tokenAccount: PublicKey
): Promise<number> {
  try {
    const account = await getAccount(connection, tokenAccount);
    return tokenAmountToNumber(new BN(account.amount.toString()));
  } catch (error) {
    return 0;
  }
}

/**
 * Get SOL balance for a given account
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return lamportsToSol(balance);
}

/**
 * Calculate token price based on asset valuation and supply
 */
export function calculateTokenPrice(valuation: BN, totalSupply: BN): number {
  if (totalSupply.isZero()) return 0;
  return tokenAmountToNumber(valuation) / tokenAmountToNumber(totalSupply);
}

/**
 * Calculate market cap
 */
export function calculateMarketCap(tokenPrice: number, totalSupply: BN): number {
  return tokenPrice * tokenAmountToNumber(totalSupply);
}

/**
 * Calculate available supply
 */
export function calculateAvailableSupply(totalSupply: BN, mintedSupply: BN): number {
  return tokenAmountToNumber(totalSupply.sub(mintedSupply));
}

/**
 * Validate public key string
 */
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry utility
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

/**
 * Generate asset PDA
 */
export function getAssetPDA(owner: PublicKey, name: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('asset'), owner.toBuffer(), Buffer.from(name)],
    new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')
  );
}

/**
 * Generate mint PDA
 */
export function getMintPDA(asset: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), asset.toBuffer()],
    new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')
  );
}
