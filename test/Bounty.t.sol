// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Bounty.sol";
import {DGRM} from "../src/DGRM.sol";
import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test, Vm} from "forge-std/Test.sol";
import {DSTest} from "ds-test/test.sol";
import {Utilities} from "./utils/Utilities.sol";

contract BountyTest is DGRM, DSTest {
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
        
        // // start prank 
        // vm.startPrank(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);

        // // deal ETH (needs to be DGRM) to digramWallet
        // vm.deal(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391, 99999999999999999 ether);

    }

    function testDGRMTransfer() public {
        address payable alice = users[0];
        // labels alice's address in call traces as "Alice [<address>]"
        vm.label(alice, "Alice");
        console.log("alice's address", alice);
        address payable bob = users[1];
        vm.label(bob, "Bob");

        vm.prank(alice);
        (bool sent, ) = bob.call{value: 10 ether}("");
        assertTrue(sent);
        assertGt(bob.balance, alice.balance);
    }

    function testBountyInit() public {
        // check we can interact with contract
        assertTrue(bountyContract.digramWallet() == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);
    }
    function testBountyCreation() public {
        // check for successful bounty creation 
        bountyContract.createBounty(0, 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391, 1, 2906490866);
    }

    function testFailBountyCreation() public {
        // check for bounty creation failure due to incorrect caller 
        bountyContract.createBounty(0, 0xa336A4091A8AA642E65eB887E78Cc22bCfF5AA95, 1, 2906490866);

        // TODO
        // check for bounty creation failure due to bountyId already existing


        // TODO
        // check for bounty creation failure due to timestamp being incorrect

    }

    function testRewardAllocation() public{
        // TODO
        // check reward allocation after setRecipient by poster
        
        // TODO
        // check reward allocation after setRecipient not by poster 
        // (i.e called by digram wallet/contract with majority votes)
    }

    function testFailRewardAllocation() public{
        // TODO
        // check reward allocation after setRecipient by non-poster

        // TODO
        // check reward allocation failure for non-bounty

        // TODO
        // check reward allocation failure for already allocated bounty
    }

    function testChangeDigramWallet() public {
        // TODO
        // check we can change digram wallet
    }
    function testFailChangeDigramWallet() public {
        // TODO
        // check for digram wallet change failure from disallowed caller
    }
}
