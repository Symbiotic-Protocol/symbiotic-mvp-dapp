//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NonProfitsHandler is Ownable {
    struct NonProfit {
        bytes32 name;
        address wallet;
    }

    event NonProfitsSet(NonProfit[] nonProfits);
    event NonProfitsAdded(NonProfit[] nonProfits);

    NonProfit[] public nonProfits;
    IERC20 public cUSD;

    constructor(address _cUsdAddress) {
        cUSD = IERC20(_cUsdAddress);
    }

    function setNonProfits(NonProfit[] calldata newNonProfits) external onlyOwner {
        nonProfits = newNonProfits;
        emit NonProfitsSet(nonProfits);
    }

    function addNonProfits(NonProfit[] calldata newNonProfits) external onlyOwner {
        for (uint i = 0; i < newNonProfits.length; i++) {
            nonProfits.push(newNonProfits[i]);
        }
        emit NonProfitsAdded(nonProfits);
    }
}
