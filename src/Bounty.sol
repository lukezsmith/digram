// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract Bounty {

    struct BountyData {
        uint256 bountyAmount;
        uint256 unlockDate;
        bool bountyExists;
        address poster;
        address recipient;
    }

    mapping(uint256 => BountyData) bounties;
    uint256[] public bountyIds;

    ERC20 private _token;

    address public digramWallet = 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391;

    modifier onlyOwner {
        require(msg.sender == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);
        _;
    }

    constructor (
        ERC20 __token
    ){
        _token = __token;
    }

    function token() public view virtual returns (ERC20) {
        return _token;
    }

    function createBounty(uint256 bountyId, address _poster, uint256 _bountyAmount, uint256 _unlockDate) public virtual onlyOwner returns (bool) {
        require((_unlockDate > block.timestamp  + 1 days) && (_bountyAmount > 0) && (!bounties[bountyId].bountyExists));
        token().transferFrom(msg.sender, address(this), _bountyAmount);
        BountyData storage newBounty = bounties[bountyId];
        newBounty.bountyAmount  = _bountyAmount;
        newBounty.poster = _poster;
        newBounty.unlockDate = _unlockDate;
        newBounty.bountyExists = true;
        return true;
    }

    function getBountyAmount(uint256 bountyId) public view virtual returns (uint256) {
        return bounties[bountyId].bountyAmount;
    }

    function getPoster(uint256 bountyId) public view virtual returns (address) {
        return bounties[bountyId].poster;
    }

    function getUnlockDate(uint256 bountyId) public view virtual returns (uint256) {
        return bounties[bountyId].unlockDate;
    }

    function getRecipient(uint256 bountyId) public view virtual returns (address)  {
        return bounties[bountyId].recipient;
    }

    function setRecipient(uint256 bountyId, address account) public virtual {
        require((msg.sender == digramWallet || msg.sender == bounties[bountyId].poster) && block.timestamp >= bounties[bountyId].unlockDate);
        // not sure this is needed after the above require
        // require(!bounties[bountyId].bountyExists);
        bounties[bountyId].recipient = account; 
        reward(bountyId);
    }

    function reward(uint256 bountyId) internal virtual returns (bool){
        uint256 amount = bounties[bountyId].bountyAmount;
        uint256 posterAmount = amount * 10 / 100;
        uint256 recipientAmount = amount * 90 / 100;
        token().transferFrom(address(this), bounties[bountyId].poster, posterAmount);
        token().transferFrom(address(this), bounties[bountyId].recipient, recipientAmount);
        return true;
    }

    function setDigramWallet(address account) public virtual onlyOwner returns (bool){
        digramWallet = account;
        return true;
    }

}