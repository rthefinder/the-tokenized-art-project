// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArtToken
 * @notice ERC-20 governance and utility token for the Tokenized Art Project
 * @dev $ART token - optional utility token for:
 * - Platform governance
 * - Community participation
 * - Signaling and curation
 * 
 * NOT a financial product or investment.
 * Purely for community and cultural participation.
 */
contract ArtToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // Hard cap

    /**
     * @notice Contract constructor
     * @param initialOwner The initial owner who receives the tokens
     */
    constructor(address initialOwner)
        ERC20("Art Token", "ART")
        ERC20Permit("Art Token")
        Ownable(initialOwner)
    {
        require(initialOwner != address(0), "Invalid initial owner");
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @notice Get the maximum supply
     * @return The maximum supply of tokens
     */
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /**
     * @notice Check if the token has reached max supply
     * @return Whether max supply has been reached
     */
    function atMaxSupply() external view returns (bool) {
        return totalSupply() >= MAX_SUPPLY;
    }
}
