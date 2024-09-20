// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CanimalToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant TOKENS_PER_TBNB = 100;

    event TokensPurchased(address indexed buyer, uint256 amount);

    constructor() ERC20("Canimal Token", "CANIMAL") Ownable(msg.sender) {
        // Initial minting can be done here if needed
        // _mint(msg.sender, INITIAL_SUPPLY);
    }

    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable nonReentrant {
        require(msg.value > 0, "Send tBNB to buy tokens");

        uint256 tokenAmount = msg.value * TOKENS_PER_TBNB;
        _mint(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, tokenAmount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No tBNB to withdraw");

        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to send tBNB");
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}