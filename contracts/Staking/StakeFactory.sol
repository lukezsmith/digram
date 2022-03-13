// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//import VRF
import "./Clones.sol";
import "./Stake.sol";

contract StakeFactory is Clones {

    mapping(address => address[]) wallets;

    address masterContract;

    event Created(
        address wallet,
        address poster,
        uint256 amount
    );

    constructor() {
        masterContract = msg.sender;
    }

    function newStake(IERC20 token, address poster) public payable returns (bool) {
        Stake stake = Stake(createClone(masterContract));
        stake.initialize(
            token,
            poster
        );
        wallets[poster].push(address(stake));
        emit Created(address(stake), poster, msg.value);
        return true;
    }

    function getWallets(address _account) public view returns(address[] memory) {
        return wallets[_account];
    }

}