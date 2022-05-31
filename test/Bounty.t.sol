// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Bounty.sol";
import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test, Vm} from "forge-std/Test.sol";
import {DSTest} from "ds-test/test.sol";
import {Utilities} from "./utils/Utilities.sol";

contract BountyTest is DSTest {
    Vm internal immutable vm = Vm(HEVM_ADDRESS);

    Utilities internal utils;
    address payable[] internal users;

    Bounty public bountyContract;

    
    function setUp() public {
        // create test users
        utils = new Utilities();
        users = utils.createUsers(5);
        // instantiate contract
        bountyContract = new Bounty();    
        
        // start prank 
        vm.startPrank(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);

        // deal ETH (needs to be DGRM) to digramWallet
        vm.deal(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391, 99999999999999999 ether);

    }

    function testBountyInit() public {
        // check we can interact with contract
        assertTrue(bountyContract.digramWallet() == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);
    }
    function testBountyCreationSuccess() public {
        // check for successful bounty creation 
        bountyContract.createBounty(0, 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391, 1, 2906490866);

    }
}