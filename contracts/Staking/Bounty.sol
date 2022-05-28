// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../utils/Ownable.sol";
import "../token/ERC20.sol";

abstract contract Bounty is ERC20 {

    IERC20 private _token;
    address private _poster;
    address private _recipient;
    uint256 public _bountyAmount;
    uint256 private _unlockDate;

    modifier onlyOwner {
        require(msg.sender == _poster);
        _;
    }

    function initialize(
        IERC20 token_,
        address poster_,
        uint256 bountyAmount_,
        uint256 unlockDate_
    ) public {
        require(unlockDate_ > block.timestamp);
        _token = token_;
        _poster = poster_;
        _bountyAmount = bountyAmount_;
        _unlockDate = unlockDate_;
        setBounty(_bountyAmount);
    }

    function bountyAmount() public view virtual returns (uint256) {
        return _bountyAmount;
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

    function setBounty(uint256 temp) public onlyOwner returns (bool) {
        token().transferFrom(msg.sender, address(this), temp);
        return true;
    }

    function reward(address account) public virtual onlyOwner returns (bool){
        setRecipient(account);
        require(block.timestamp >= unlockDate());
        uint256 amount = token().balanceOf(address(this));
        require(amount > 0);
        uint256 posterAmount = amount * 10 / 100;
        uint256 recipientAmount = amount * 90 / 100;
        token().transferFrom(address(this), poster(), posterAmount);
        token().transferFrom(address(this), recipient(), recipientAmount);
        return true;
    }

}