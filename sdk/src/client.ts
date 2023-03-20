import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { Program, AnchorProvider, Wallet, BN } from '@coral-xyz/anchor';
import { 
  CreateAssetParams, 
  MintTokensParams, 
  BuyFractionParams, 
  TransferTokensParams, 
  RedeemParams,
  Asset,
  AssetWithMetadata,
  AssetMetadata,
  TransactionResult,
  WalletBalance,
} from './types';
import { 
  PROGRAM_ID, 
  NETWORKS, 
  DEFAULT_NETWORK, 
  CONFIRMATION_OPTIONS,
  ERROR_MESSAGES,
} from './constants';
import {
  getTokenAddress,
  getUsdcMint,
  getTokenBalance,
  getSolBalance,
  calculateTokenPrice,
  calculateMarketCap,
  calculateAvailableSupply,
  getAssetPDA,
  getMintPDA,
  numberToTokenAmount,
  tokenAmountToNumber,
  retry,
} from './utils';

// Import the IDL (this would be generated from the Anchor program)
// For now, we'll define a basic structure
const IDL = {
  "version": "0.1.0",
  "name": "rwa_token",
  "instructions": [
    {
      "name": "initializeAsset",
      "accounts": [
        { "name": "asset", "isMut": true, "isSigner": false },
        { "name": "mint", "isMut": true, "isSigner": false },
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "valuation", "type": "u64" },
        { "name": "assetType", "type": { "defined": "AssetType" } },
        { "name": "metadataUri", "type": "string" },
        { "name": "totalSupply", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Asset",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "owner", "type": "publicKey" },
          { "name": "name", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "valuation", "type": "u64" },
          { "name": "assetType", "type": { "defined": "AssetType" } },
          { "name": "metadataUri", "type": "string" },
          { "name": "totalSupply", "type": "u64" },
          { "name": "mintedSupply", "type": "u64" },
          { "name": "createdAt", "type": "i64" },
          { "name": "lastMintAt", "type": "i64" },
          { "name": "lastRedeemAt", "type": "i64" },
          { "name": "isActive", "type": "bool" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AssetType",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "Land" },
          { "name": "Art" },
          { "name": "Carbon" },
          { "name": "RealEstate" },
          { "name": "Commodity" },
          { "name": "Other" }
        ]
      }
    }
  ]
};

export class RWAPortalClient {
  private connection: Connection;
  private program: Program;
  private network: keyof typeof NETWORKS;
  private usdcMint: PublicKey;

  constructor(
    connection: Connection,
    wallet: Wallet,
    network: keyof typeof NETWORKS = DEFAULT_NETWORK
  ) {
    this.connection = connection;
    this.network = network;
    this.usdcMint = getUsdcMint(network);
    
    const provider = new AnchorProvider(connection, wallet, {
      commitment: CONFIRMATION_OPTIONS.commitment,
      preflightCommitment: CONFIRMATION_OPTIONS.preflightCommitment,
    });
    
    this.program = new Program(IDL as any, PROGRAM_ID, provider);
  }

  /**
   * Create a new RWA asset
   */
  async createAsset(params: CreateAssetParams): Promise<TransactionResult> {
    try {
      const wallet = this.program.provider.wallet as Wallet;
      const owner = wallet.publicKey;

      const [assetPDA] = getAssetPDA(owner, params.name);
      const [mintPDA] = getMintPDA(assetPDA);

      const tx = await this.program.methods
        .initializeAsset(
          params.name,
          params.description,
          new BN(params.valuation),
          { [params.assetType.toLowerCase()]: {} },
          params.metadataUri,
          new BN(params.totalSupply)
        )
        .accounts({
          asset: assetPDA,
          mint: mintPDA,
          owner,
          systemProgram: SystemProgram.programId,
          tokenProgram: this.program.programId,
          rent: PublicKey.default,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Mint fractional tokens for an asset
   */
  async mintTokens(params: MintTokensParams): Promise<TransactionResult> {
    try {
      const wallet = this.program.provider.wallet as Wallet;
      const authority = wallet.publicKey;

      const asset = await this.getAsset(params.assetAddress);
      if (!asset) {
        throw new Error(ERROR_MESSAGES.ASSET_NOT_FOUND);
      }

      const [mintPDA] = getMintPDA(params.assetAddress);
      const tokenAccount = await getTokenAddress(mintPDA, authority);

      const tx = await this.program.methods
        .mintFractionalTokens(new BN(params.amount))
        .accounts({
          asset: params.assetAddress,
          mint: mintPDA,
          tokenAccount,
          authority,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Buy fractional ownership via USDC
   */
  async buyFraction(params: BuyFractionParams): Promise<TransactionResult> {
    try {
      const wallet = this.program.provider.wallet as Wallet;
      const buyer = wallet.publicKey;

      const [mintPDA] = getMintPDA(params.assetAddress);
      const buyerUsdcAccount = await getTokenAddress(this.usdcMint, buyer);
      const buyerTokenAccount = await getTokenAddress(mintPDA, buyer);

      const asset = await this.getAsset(params.assetAddress);
      if (!asset) {
        throw new Error(ERROR_MESSAGES.ASSET_NOT_FOUND);
      }

      const ownerUsdcAccount = await getTokenAddress(this.usdcMint, asset.owner);

      const tx = await this.program.methods
        .buyFraction(
          new BN(params.usdcAmount),
          new BN(params.expectedTokens)
        )
        .accounts({
          asset: params.assetAddress,
          mint: mintPDA,
          buyer,
          buyerUsdcAccount,
          buyerTokenAccount,
          ownerUsdcAccount,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Transfer fractional tokens between users
   */
  async transferTokens(params: TransferTokensParams): Promise<TransactionResult> {
    try {
      const tx = await this.program.methods
        .transferFractionalTokens(new BN(params.amount))
        .accounts({
          fromTokenAccount: params.fromTokenAccount,
          toTokenAccount: params.toTokenAccount,
          fromAuthority: this.program.provider.wallet.publicKey,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Redeem fractional tokens
   */
  async redeem(params: RedeemParams): Promise<TransactionResult> {
    try {
      const wallet = this.program.provider.wallet as Wallet;
      const user = wallet.publicKey;

      const [mintPDA] = getMintPDA(params.assetAddress);
      const userTokenAccount = await getTokenAddress(mintPDA, user);

      const tx = await this.program.methods
        .redeem(new BN(params.tokenAmount))
        .accounts({
          asset: params.assetAddress,
          mint: mintPDA,
          user,
          userTokenAccount,
        })
        .rpc();

      return { signature: tx, success: true };
    } catch (error) {
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get asset information
   */
  async getAsset(assetAddress: PublicKey): Promise<Asset | null> {
    try {
      const assetAccount = await this.program.account.asset.fetch(assetAddress);
      
      return {
        owner: assetAccount.owner,
        name: assetAccount.name,
        description: assetAccount.description,
        valuation: new BN(assetAccount.valuation.toString()),
        assetType: assetAccount.assetType,
        metadataUri: assetAccount.metadataUri,
        totalSupply: new BN(assetAccount.totalSupply.toString()),
        mintedSupply: new BN(assetAccount.mintedSupply.toString()),
        createdAt: new BN(assetAccount.createdAt.toString()),
        lastMintAt: new BN(assetAccount.lastMintAt.toString()),
        lastRedeemAt: new BN(assetAccount.lastRedeemAt.toString()),
        isActive: assetAccount.isActive,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get asset with metadata and calculated values
   */
  async getAssetWithMetadata(assetAddress: PublicKey): Promise<AssetWithMetadata | null> {
    const asset = await this.getAsset(assetAddress);
    if (!asset) return null;

    const tokenPrice = calculateTokenPrice(asset.valuation, asset.totalSupply);
    const marketCap = calculateMarketCap(tokenPrice, asset.totalSupply);
    const availableSupply = calculateAvailableSupply(asset.totalSupply, asset.mintedSupply);

    let metadata: AssetMetadata | undefined;
    try {
      const response = await fetch(asset.metadataUri);
      metadata = await response.json();
    } catch (error) {
      console.warn('Failed to fetch metadata:', error);
    }

    return {
      ...asset,
      metadata,
      tokenPrice,
      marketCap,
      availableSupply,
    };
  }

  /**
   * Get all assets (this would need to be implemented with a proper indexing solution)
   */
  async getAllAssets(): Promise<Asset[]> {
    // This is a simplified implementation
    // In a real application, you'd use a proper indexing solution
    try {
      const accounts = await this.program.account.asset.all();
      return accounts.map(account => ({
        owner: account.account.owner,
        name: account.account.name,
        description: account.account.description,
        valuation: new BN(account.account.valuation.toString()),
        assetType: account.account.assetType,
        metadataUri: account.account.metadataUri,
        totalSupply: new BN(account.account.totalSupply.toString()),
        mintedSupply: new BN(account.account.mintedSupply.toString()),
        createdAt: new BN(account.account.createdAt.toString()),
        lastMintAt: new BN(account.account.lastMintAt.toString()),
        lastRedeemAt: new BN(account.account.lastRedeemAt.toString()),
        isActive: account.account.isActive,
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Get wallet balances
   */
  async getWalletBalance(publicKey: PublicKey): Promise<WalletBalance> {
    const [solBalance, usdcBalance] = await Promise.all([
      getSolBalance(this.connection, publicKey),
      retry(() => getTokenBalance(this.connection, await getTokenAddress(this.usdcMint, publicKey))),
    ]);

    return {
      sol: solBalance,
      usdc: usdcBalance,
      tokens: {}, // This would be populated with token balances
    };
  }

  /**
   * Get token balance for a specific asset
   */
  async getTokenBalanceForAsset(assetAddress: PublicKey, owner: PublicKey): Promise<number> {
    try {
      const [mintPDA] = getMintPDA(assetAddress);
      const tokenAccount = await getTokenAddress(mintPDA, owner);
      return await getTokenBalance(this.connection, tokenAccount);
    } catch (error) {
      return 0;
    }
  }
}
