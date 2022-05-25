//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NonProfitsHandler.sol";

contract SymbioticProtocol is ERC20, NonProfitsHandler {
    using SafeMath for uint256;

    uint public percentageSymbMint = 1;

    event Donated(bytes32 nonProfitName, uint amountUsd);
    event PercentageSymbMintChanged(uint newPercentage);

    constructor(address _cUsdAddress) NonProfitsHandler(_cUsdAddress) ERC20("Symbiotic Token", "SYMB") {} 

    function donate(uint nonProfitIndex, uint amountUsd) external {
        require(nonProfitIndex < nonProfits.length, "Index does not exist.");
        require(cUSD.balanceOf(msg.sender) >= amountUsd, "Sender does not have that amount.");
        
        _mint(msg.sender, getSymbAmount(amountUsd));
        cUSD.transferFrom(msg.sender, nonProfits[nonProfitIndex].wallet, amountUsd);
        
        emit Donated(nonProfits[nonProfitIndex].name, amountUsd);
    }

    function getSymbAmount(uint amountUsd) view internal returns (uint) {
        // TODO: should eventually replace this with a fraction of an oracle price or something
        return amountUsd.mul(percentageSymbMint).div(100);
    }

    function setPercentageSymbMint(uint percentage) external onlyOwner {
        percentageSymbMint = percentage;
        emit PercentageSymbMintChanged(percentage);
    }
}
