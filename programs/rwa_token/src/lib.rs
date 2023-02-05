use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod rwa_token {
    use super::*;

    /// Initialize a new RWA asset with metadata
    pub fn initialize_asset(
        ctx: Context<InitializeAsset>,
        name: String,
        description: String,
        valuation: u64,
        asset_type: AssetType,
        metadata_uri: String,
        total_supply: u64,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        let clock = Clock::get()?;

        // Validate inputs
        require!(name.len() <= 50, ErrorCode::NameTooLong);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);
        require!(metadata_uri.len() <= 200, ErrorCode::MetadataUriTooLong);
        require!(total_supply > 0, ErrorCode::InvalidSupply);
        require!(valuation > 0, ErrorCode::InvalidValuation);

        asset.owner = ctx.accounts.owner.key();
        asset.name = name;
        asset.description = description;
        asset.valuation = valuation;
        asset.asset_type = asset_type;
        asset.metadata_uri = metadata_uri;
        asset.total_supply = total_supply;
        asset.minted_supply = 0;
        asset.created_at = clock.unix_timestamp;
        asset.is_active = true;

        Ok(())
    }

    /// Mint fractional SPL tokens linked to the asset
    pub fn mint_fractional_tokens(
        ctx: Context<MintFractionalTokens>,
        amount: u64,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        let clock = Clock::get()?;

        // Validate minting
        require!(asset.is_active, ErrorCode::AssetInactive);
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(
            asset.minted_supply + amount <= asset.total_supply,
            ErrorCode::SupplyExceeded
        );

        // Check authority
        require!(
            ctx.accounts.authority.key() == asset.owner,
            ErrorCode::Unauthorized
        );

        // Mint tokens
        let seeds = &[
            b"asset",
            asset.key().as_ref(),
            &[ctx.bumps.asset],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.asset.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::mint_to(cpi_ctx, amount)?;

        // Update asset state
        asset.minted_supply += amount;
        asset.last_mint_at = clock.unix_timestamp;

        Ok(())
    }

    /// Transfer fractional tokens between users
    pub fn transfer_fractional_tokens(
        ctx: Context<TransferFractionalTokens>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let transfer_instruction = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    /// Buy fractional ownership via USDC
    pub fn buy_fraction(
        ctx: Context<BuyFraction>,
        usdc_amount: u64,
        expected_tokens: u64,
    ) -> Result<()> {
        let asset = &ctx.accounts.asset;
        let clock = Clock::get()?;

        require!(asset.is_active, ErrorCode::AssetInactive);
        require!(usdc_amount > 0, ErrorCode::InvalidAmount);
        require!(expected_tokens > 0, ErrorCode::InvalidAmount);

        // Calculate token price based on asset valuation
        let token_price = asset.valuation / asset.total_supply;
        let expected_usdc = expected_tokens * token_price;

        // Allow 1% slippage
        require!(
            usdc_amount >= expected_usdc * 99 / 100,
            ErrorCode::SlippageExceeded
        );

        // Transfer USDC from buyer to asset owner
        let transfer_instruction = Transfer {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.owner_usdc_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        token::transfer(cpi_ctx, usdc_amount)?;

        // Mint tokens to buyer
        let seeds = &[
            b"asset",
            asset.key().as_ref(),
            &[ctx.bumps.asset],
        ];
        let signer = &[&seeds[..]];

        let mint_instruction = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.asset.to_account_info(),
        };

        let mint_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_instruction,
            signer,
        );

        token::mint_to(mint_cpi_ctx, expected_tokens)?;

        Ok(())
    }

    /// Redeem fractional tokens to claim ownership (for RWA exit)
    pub fn redeem(
        ctx: Context<Redeem>,
        token_amount: u64,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        let clock = Clock::get()?;

        require!(asset.is_active, ErrorCode::AssetInactive);
        require!(token_amount > 0, ErrorCode::InvalidAmount);

        // Check if user has enough tokens
        let user_token_account = &ctx.accounts.user_token_account;
        require!(
            user_token_account.amount >= token_amount,
            ErrorCode::InsufficientTokens
        );

        // Burn tokens
        let seeds = &[
            b"asset",
            asset.key().as_ref(),
            &[ctx.bumps.asset],
        ];
        let signer = &[&seeds[..]];

        let burn_instruction = token::Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.asset.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            burn_instruction,
            signer,
        );

        token::burn(cpi_ctx, token_amount)?;

        // Update asset state
        asset.minted_supply -= token_amount;
        asset.last_redeem_at = clock.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, description: String, valuation: u64, asset_type: AssetType, metadata_uri: String, total_supply: u64)]
pub struct InitializeAsset<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Asset::INIT_SPACE,
        seeds = [b"asset", owner.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub asset: Account<'info, Asset>,

    #[account(
        init,
        payer = owner,
        mint::decimals = 6,
        mint::authority = asset,
        seeds = [b"mint", asset.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintFractionalTokens<'info> {
    #[account(
        mut,
        seeds = [b"asset", asset.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub asset: Account<'info, Asset>,

    #[account(
        mut,
        seeds = [b"mint", asset.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferFractionalTokens<'info> {
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    pub from_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BuyFraction<'info> {
    #[account(
        seeds = [b"asset", asset.key().as_ref()],
        bump
    )]
    pub asset: Account<'info, Asset>,

    #[account(
        seeds = [b"mint", asset.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub buyer_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(
        mut,
        seeds = [b"asset", asset.key().as_ref()],
        bump
    )]
    pub asset: Account<'info, Asset>,

    #[account(
        seeds = [b"mint", asset.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Asset {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub valuation: u64, // in USDC (6 decimals)
    pub asset_type: AssetType,
    pub metadata_uri: String,
    pub total_supply: u64,
    pub minted_supply: u64,
    pub created_at: i64,
    pub last_mint_at: i64,
    pub last_redeem_at: i64,
    pub is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AssetType {
    Land,
    Art,
    Carbon,
    RealEstate,
    Commodity,
    Other,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Metadata URI is too long")]
    MetadataUriTooLong,
    #[msg("Invalid supply amount")]
    InvalidSupply,
    #[msg("Invalid valuation")]
    InvalidValuation,
    #[msg("Asset is inactive")]
    AssetInactive,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Supply exceeded")]
    SupplyExceeded,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Slippage exceeded")]
    SlippageExceeded,
    #[msg("Insufficient tokens")]
    InsufficientTokens,
}
