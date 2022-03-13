// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './Ownable.sol';

// This is a truffle contract, needed for truffle integration, not meant for use by Zeppelin users. 
contract Migrations is Ownable {
  uint public lastCompletedMigration;

  function setCompleted(uint completed) public onlyOwner {
    lastCompletedMigration = completed;
  }

  function upgrade(address newAddress) public onlyOwner {
    Migrations upgraded = Migrations(newAddress);
    upgraded.setCompleted(lastCompletedMigration);
  }
}
