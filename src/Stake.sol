// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import VRF
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract Stake {

    struct Pool {
        uint256 poolAmount;
        bool poolExists;
        Voter[] poolVoters;
        mapping (uint256 => Voter) voters;
        address[] voterAddresses;
    }

    mapping (uint256 => Pool) public pools;    

    struct Voter {
        address voterAddress;
        uint256 numberVotes;
        uint256 index;
    }

    uint256[] public poolIds;
    
    // address[] public voterAddresses;
    
    ERC20 private _token;
    uint256 public _pool;
    uint256 public denomination;
    uint public maxEntries;

    address public digramWallet = 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391;

    modifier onlyOwner {
        require(msg.sender == digramWallet);
        _;
    }

    function initialize(
        ERC20 __token
    ) public {
        _token = __token;
    }

    function token() public view virtual returns (ERC20) {
        return _token;
    }

    function setDenomination(uint256 denom) public onlyOwner returns (bool) {
        denomination = denom;
        return true;
    }

    function getDenomination() public view returns (uint256) {
        return denomination;
    }

    function getPool(uint256 poolId) internal view returns (Pool storage) {
        return pools[poolId];
    }

    function createPool(uint256 poolId) public returns (bool){
        Pool storage newPool = pools[poolId];
        newPool.poolAmount = 0;
        newPool.poolExists = true;
        return true;
    }

    // function isNewVoter(uint256 poolId, uint256 voterId) public view returns (bool) {
    //     // memory or storage here?
    //     Pool storage pool = pools[poolId];
    //     require(pool.poolExists);
    //     return (pool.voterAddresses[pool.voters[voterId].index]
    //     // return (pool.voterAddresses[pool.voters[voterId].index] != voterId);
    // }

    // TODO
    function addVoter(uint256 poolId, uint256 voterId) public returns (bool) {
        require(pools[poolId].poolExists);

        Voter storage newVoter = pools[poolId].voters[voterId];
        newVoter.voterAddress = msg.sender;
        newVoter.numberVotes = 0;
        // maybe?
        pools[poolId].poolVoters.push(newVoter);
        return true;
    }

    function updatePool(uint256 poolId, uint256 amount) public onlyOwner returns (bool) {
        // _pool += amount;
        pools[poolId].poolAmount = amount; 
        return true;
    }

    function getCost(uint256 poolId, uint256 voterId) public view returns (uint256) {
        require(pools[poolId].poolExists);
        uint256 currentCost;
        currentCost = (pools[poolId].voters[voterId].numberVotes) ** 2;
        return currentCost;
    }

    function addVote(uint256 poolId, uint256 voterId) public payable returns (bool) {
        // memory or storage here?
        Pool storage pool = pools[poolId];
        require(pool.poolExists);
        pool.voters[voterId].numberVotes += 1;
        pool.voterAddresses.push(msg.sender);
        uint256 cost = getCost(poolId, voterId);
        updatePool(poolId, cost);
        token().transferFrom(msg.sender, address(this), cost);
        return true;
    }
    
    // memory or storage here?
    function pickWinner(Pool storage pool) internal view returns(address) {
        uint256 index;
        address winner;
        // TODO
        // generate index via ChainLink VRF
        winner = pool.voterAddresses[index];
        return winner;
    }

    function allocatePool(uint256 poolId) private {
        // memory or storage here?
        Pool storage pool = pools[poolId];
        require(pool.poolExists);
        address winner = pickWinner(pool);
        uint256 toTransfer = address(this).balance;
        payable(winner).transfer(toTransfer);
    }

    function setDigramWallet(address wallet) public virtual onlyOwner returns (bool){
        digramWallet = wallet;
        return true;
    }

}