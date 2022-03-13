// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Clones.sol";
import "./Bounty.sol";

contract BountyFactory is Clones {

    mapping(address => address[]) wallets;

    address masterContract;

    event Created(
        address wallet,
        address poster,
        uint256 unlockDate,
        uint256 amount
    );

    constructor() {
        masterContract = msg.sender;
    }

    function newBounty(IERC20 token, address poster, uint256 unlockDate) public payable returns (bool) {
        Bounty bounty = Bounty(createClone(masterContract));
        bounty.initialize(
            token,
            poster,
            unlockDate
        );
        wallets[poster].push(address(bounty));
        emit Created(address(bounty), poster, unlockDate, msg.value);
        return true;
    }

    function getWallets(address _account) public view returns(address[] memory) {
        return wallets[_account];
    }

}