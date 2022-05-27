const { expect } = require("chai");
const { ethers } = require("hardhat");
const addresses = require("../addresses.json");

describe("SymbioticProtocol", function () {
  let SymbioticProtocol;
  before(async () => {
    const SymbioticProtocol = await ethers.getContractFactory("SymbioticProtocol");
    // Alfajores
    // symbioticProtocol = await SymbioticProtocol.attach("0xAeA835150dA111e82424474c104432D245fC3B78");
    
    // local testnet
    symbioticProtocol = await SymbioticProtocol.deploy(addresses.alfajoresCeloDollarAddress);
    await symbioticProtocol.deployed();
  });

  it("Should set list of nonProfits", async function () {
    const nonProfits = [
      {
        name: ethers.utils.formatBytes32String('Santa Casa'),
        wallet: "0x5409ed021d9299bf6814279a6a1411a7e866a631"
      },
      {
        name: ethers.utils.formatBytes32String('Unicef'),
        wallet: "0x6ecbe1db9ef729cbe972c83fb886247691fb6beb"
      }
    ]

    const tx1 = await symbioticProtocol.setNonProfits(nonProfits);
    await tx1.wait()
    
    const nonProfit = await symbioticProtocol.getNonProfits()
    expect(nonProfit[0].name).to.be.equal(nonProfits[0].name);
  });

  it.skip("Should donate (in Alfajores)", async function () {
    const erc20 = await ethers.getContractFactory('ERC20');
    const cusd = await erc20.attach('0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1')

    const value = ethers.BigNumber.from('10000000000000')

    const tx1 = await cusd.approve(symbioticProtocol.address, value)
    await tx1.wait()

    const tx2 = await symbioticProtocol.donate(0, value);
    await tx2.wait()

    console.log('Donated!')

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

    const symbBalance = await symbioticProtocol.balanceOf(wallet.address)
    console.log('SYMB balance:', symbBalance)
  });
});
