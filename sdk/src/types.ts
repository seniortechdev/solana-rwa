import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export enum AssetType {
  Land = 'Land',
  Art = 'Art',
  Carbon = 'Carbon',
  RealEstate = 'RealEstate',
  Commodity = 'Commodity',
  Other = 'Other',
}

export interface Asset {
  owner: PublicKey;
  name: string;
  description: string;
  valuation: BN;
  assetType: AssetType;
  metadataUri: string;
  totalSupply: BN;
  mintedSupply: BN;
  createdAt: BN;
  lastMintAt: BN;
  lastRedeemAt: BN;
  isActive: boolean;
}

export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
  };
}

export interface CreateAssetParams {
  name: string;
  description: string;
  valuation: number; // in USDC (6 decimals)
  assetType: AssetType;
  metadataUri: string;
  totalSupply: number;
}

export interface MintTokensParams {
  assetAddress: PublicKey;
  amount: number;
}

export interface BuyFractionParams {
  assetAddress: PublicKey;
  usdcAmount: number;
  expectedTokens: number;
}

export interface TransferTokensParams {
  fromTokenAccount: PublicKey;
  toTokenAccount: PublicKey;
  amount: number;
}

export interface RedeemParams {
  assetAddress: PublicKey;
  tokenAmount: number;
}

export interface WalletBalance {
  sol: number;
  usdc: number;
  tokens: Record<string, number>;
}

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export interface AssetWithMetadata extends Asset {
  metadata?: AssetMetadata;
  tokenPrice: number;
  marketCap: number;
  availableSupply: number;
}
