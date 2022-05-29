// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import VRF
import "../token/ERC20.sol";
import "../utils/Ownable.sol";

abstract contract Stake is ERC20, Ownable {

    struct Voter {
        address voterAddress;
        uint256 numberVotes;
        uint256 index;
    }

    mapping (address => Voter) public voters;
    
    address[] public voterAddresses;
    
    IERC20 private _token;
    address private _poster;
    uint256 public _pool;
    uint256 public _denomination;
    uint public maxEntries;

    function initialize(
        IERC20 token_,
        address poster_
    ) public {
        _token = token_;
        _poster = poster_;
    }

    function setDenomination(uint256 denom) public onlyOwner returns (bool) {
        _denomination = denom;
        return true;
    }

    function getDenomination() public view returns (uint256) {
        return _denomination;
    }

    function getPool() public view returns (uint256) {
        return _pool;
    }

    function isNewVoter(address account) public view returns (bool) {
        return (voterAddresses[voters[account].index] != account);
    }

    function addVoter() public returns (bool) {
        voters[msg.sender].voterAddress = msg.sender;
        voters[msg.sender].numberVotes = 0;
        return true;
    }

    function updatePool(uint256 amount) public returns (bool) {
        _pool += amount;
        return true;
    }

    function getCost(address account) public view returns (uint256) {
        uint256 currentCost;
        currentCost = (voters[account].numberVotes) ** 2;
        return currentCost;
    }

    function addVote() public payable returns (bool) {
        voters[msg.sender].numberVotes += 1;
        voterAddresses.push(msg.sender);
        uint256 cost = getCost(msg.sender);
        updatePool(cost);
        transferFrom(msg.sender, address(this), cost);
        return true;
    }

    function pickWinner() public view returns(address) {
        uint256 index;
        address winner;
        // line for chainlink VRF to update index
        winner = voterAddresses[index];
        return winner;
    }

    function allocatePool() private {
        address winner = pickWinner();
        uint256 toTransfer = address(this).balance;
        payable(winner).transfer(toTransfer);
    }

}