// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PataToken is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("PATA Token", "PATA") 
        Ownable(initialOwner)
    {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1 million PATA tokens
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 