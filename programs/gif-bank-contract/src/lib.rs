use anchor_lang::prelude::*;

declare_id!("E8Eyj3PGqD1nTcB7L9UuX3MkaW3YJXoT11hx81YbfCnp");

#[program]
pub mod gif_bank_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;

        base_account.total_gifs = 0;

        Ok(())
    }

    pub fn add(ctx: Context<Add>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let gif = Gif {
            url: gif_link,
            user_address: user.key(),
        };

        base_account.gifs.push(gif);
        base_account.total_gifs += 1;

        Ok(())
    }

    pub fn delete(ctx: Context<Delete>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;
        let mut index = 0;

        for (i, gif) in base_account.gifs.iter().enumerate() {
            if gif.url == gif_link && gif.user_address == user.key() {
                index = i;
            }
        }

        base_account.gifs.remove(index);
        base_account.total_gifs -= 1;

        Ok(())
    }
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gifs: Vec<Gif>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Add<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Gif {
    pub url: String,
    pub user_address: Pubkey,
}
