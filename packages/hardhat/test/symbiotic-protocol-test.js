const { expect } = require("chai");
const { ethers } = require("hardhat");
const addresses = require("../addresses.json");

describe("SymbioticProtocol", function () {
  it("Should return the new greeting once it's changed", async function () {
    const SymbioticProtocol = await ethers.getContractFactory("SymbioticProtocol");
    const symbioticProtocol = await SymbioticProtocol.deploy(addresses.alfajoresCeloDollarAddress);
    await symbioticProtocol.deployed();

    expect(await symbioticProtocol.greet()).to.equal("Hello, world!");

    const setGreetingTx = await symbioticProtocol.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await symbioticProtocol.greet()).to.equal("Hola, mundo!");
  });
});
