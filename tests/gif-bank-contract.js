const anchor = require("@project-serum/anchor");
const { expect } = require("chai");

describe("gif-bank-contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  
  it("Initialize", async () => {
    const { SystemProgram } = anchor.web3;
    const program = anchor.workspace.GifBankContract;
    const baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    })

    expect(tx).to.ok;
  });
  
  it("Get GIF count", async () => {
    const { SystemProgram } = anchor.web3;

    const program = anchor.workspace.GifBankContract;
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    })

    const newBaseAccount = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(newBaseAccount.totalGifs.toString()).equals("0")
  });

  it("Add a GIF", async () => {
    const { SystemProgram } = anchor.web3;

    const program = anchor.workspace.GifBankContract;
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    })

    const baseAccountBeforeAdd = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(baseAccountBeforeAdd.totalGifs.toString()).equals("0")

    await program.rpc.add('https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
      },
    })

    const baseAccountAfterAdd = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(baseAccountAfterAdd.totalGifs.toString()).equals("1")
    expect(baseAccountAfterAdd.gifs[0].url).equals('https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy')
  });

  it("Remove a GIF", async () => {
    const { SystemProgram } = anchor.web3;

    const program = anchor.workspace.GifBankContract;
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    })

    await program.rpc.add('https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
      },
    })

    const baseAccountBeforeRemove = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(baseAccountBeforeRemove.totalGifs.toString()).equals("1")

    await program.rpc.delete('https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchor.getProvider().wallet.publicKey,
      },
    })

    const baseAccountAfterRemove = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(baseAccountAfterRemove.totalGifs.toString()).equals("0")
  });
});
