// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../utils/Ownable.sol";
import "../token/ERC20.sol";

contract Bounty {

    IERC20 private _token;
    address private _poster;
    address private _recipient;
    uint256 private _unlockDate;

    modifier onlyOwner {
        require(msg.sender == _poster);
        _;
    }

    function initialize(
        IERC20 token_,
        address poster_,
        uint256 unlockDate_
    ) public {
        require(unlockDate_ > block.timestamp);
        _token = token_;
        _poster = poster_;
        _unlockDate = unlockDate_;
    }

    function token() public view virtual returns (IERC20) {
        return _token;
    }

    function poster() public view virtual returns (address) {
        return _poster;
    }

    function setRecipient(address account) public virtual onlyOwner {
        _recipient = account;
    }

    function recipient() public view virtual returns (address) {
        return _poster;
    }

    function unlockDate() public view virtual returns (uint256) {
        return _unlockDate;
    }

    function reward() public virtual onlyOwner returns (bool){
        require(block.timestamp >= unlockDate());
        uint256 amount = token().balanceOf(address(this));
        require(amount > 0);
        uint256 posterAmount = amount * 10 / 100;
        uint256 recipientAmount = amount * 90 / 100;
        token().transfer(poster(), posterAmount);
        token().transfer(recipient(), recipientAmount);
        return true;
    }

}