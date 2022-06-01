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
    address payable alice;
    address payable bob;
    address payable digramWallet = payable(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);

    Bounty public bountyContract;


    function setUp() public {

        // create test users
        utils = new Utilities();
        users = utils.createUsers(5);

        // instantiate contract
        bountyContract = new Bounty(this);

        // labels alice/bob address in call traces as "Alice [<address>]"
        alice = users[0];
        vm.label(alice, "Alice");
        bob = users[1];
        vm.label(bob, "Bob");

        // allocate DGRM to digramWallet
        vm.deal(digramWallet, 100 ether);
        _mint(digramWallet, 100);

        // mint DGRM to first two users
        _mint(alice, 100);
        _mint(bob, 100);

        vm.prank(alice);
        //this.approve(digramWallet,0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        this.approve(address(bountyContract),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        //vm.stopPrank();

        //vm.prank(digramWallet);
        //this.approve(alice,0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        //this.approve(address(bountyContract),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        //vm.stopPrank();

    }


    function testDGRMTransfer() public {

        // test a DGRM transfer between two wallets

        vm.prank(alice);
        bool sent  =  this.transfer(bob, 10);
        assertTrue(sent);
        assertGt(this.balanceOf(bob), this.balanceOf(alice));

    }


    function testBountyInit() public {

        // check we can interact with contract

        assertTrue(bountyContract.digramWallet() == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);

    }


    function testBountyCreation() public {

        // check for successful bounty creation

        vm.startPrank(alice);

        assertTrue(bountyContract.createBounty(0, 1, 2906490866));
        assertEq(this.balanceOf(alice), 99);
        assertEq(bountyContract.getPoster(0), alice);

        vm.stopPrank();

    }


    function testFailBountyCreationId() public {

        // check for bounty creation failure due to bountyId already existing

        vm.startPrank(alice);

        bountyContract.createBounty(2, 1, 2906490866);
        assertTrue(bountyContract.createBounty(2, 1, 2906490866));

        vm.stopPrank();

    }


    function testFailBountyCreationTime() public {

        // check for bounty creation failure due to timestamp being incorrect

        vm.prank(alice);      
        assertTrue(bountyContract.createBounty(3, 1, 22));

    }


    function testFailBountyCreationFunds() public {

        // check for bounty creation failure due to insufficient funds

        vm.prank(alice);
        assertTrue(bountyContract.createBounty(4, 200, 2906490866));

    }


    function testRewardAllocationPoster() public {
    
        // check reward allocation after setRecipient by poster

        vm.startPrank(alice);

        bountyContract.createBounty(5, 10, 2906490866);

        vm.warp(2906490867);

        bountyContract.setRecipient(5, bob);

        assertEq(this.balanceOf(bob), 109);
        assertEq(this.balanceOf(alice), 91);

        vm.stopPrank();

    }


    function testRewardAllocationDigram() public {

        // check reward allocation after setRecipient not by poster

        vm.startPrank(alice);

        bountyContract.createBounty(6, 10, 2906490866);

        vm.stopPrank();

        vm.warp(2906490867);

        vm.startPrank(digramWallet);

        bountyContract.setRecipient(6, bob);

        assertEq(this.balanceOf(bob), 109);
        assertEq(this.balanceOf(alice), 91);

        vm.stopPrank();       

    }


    function testFailRewardAllocation() public {

        // check reward allocation after setRecipient by non-poster

        vm.prank(alice);
        bountyContract.createBounty(7, 10, 2906490866);

        vm.warp(2906490867);

        vm.prank(bob);
        assertTrue(bountyContract.setRecipient(7, bob));   

    }


    function testFailRewardAllocationTime() public {

        // check failure for attempting to set the recipient before the unlock date

        vm.startPrank(alice);

        bountyContract.createBounty(8, 10, 2906490866);

        vm.warp(2906490815);

        assertTrue(bountyContract.setRecipient(8, bob));

        vm.stopPrank();         

    }


    function testFailRewardAllocationNonBounty() public {

        // check reward allocation failure for non-bounty

        vm.prank(alice);
        assertTrue(bountyContract.setRecipient(9, bob));

    }


    function testFailRewardAllocationResolved() public {

        // check reward allocation failure for already allocated bounty

        vm.startPrank(alice);

        bountyContract.createBounty(10, 10, 2906490866);

        vm.warp(2906490867);

        bountyContract.setRecipient(10, bob);

        assertTrue(bountyContract.setRecipient(10, bob));

        vm.stopPrank(); 

    }


    function testChangeDigramWallet() public {

        // check we can change digram wallet

        vm.prank(digramWallet);
        assertTrue(bountyContract.setDigramWallet(alice));

    }


    function testFailChangeDigramWallet() public {

        // check for digram wallet change failure from disallowed caller

        vm.prank(alice);
        assertTrue(bountyContract.setDigramWallet(bob));

    }
}
