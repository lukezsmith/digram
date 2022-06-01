// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Stake.sol";
import {DGRM} from "../src/DGRM.sol";
import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test, Vm} from "forge-std/Test.sol";
import {DSTest} from "ds-test/test.sol";
import {Utilities} from "./utils/Utilities.sol";

contract StakeTest is DGRM, DSTest {
    Vm internal immutable vm = Vm(HEVM_ADDRESS);

    Utilities internal utils;
    address payable[] internal users;
    address payable alice;
    address payable bob;

    Stake public stakeContract;

    function setUp() public {

        // create test users
        utils = new Utilities();
        users = utils.createUsers(5);

        // labels alice/bob address in call traces as "Alice [<address>]"
        alice = users[0];
        vm.label(alice, "Alice");
        console.log("alice's address", alice);
        bob = users[1];
        vm.label(bob, "Bob");

        // mint DGRM to first alice, bob users
        _mint(alice, 100);
        _mint(bob, 100);

        // instantiate contract
        stakeContract = new Stake();
        
    }

    function testDGRMTransfer() public {
        vm.prank(alice);
        bool sent  =  this.transfer(bob, 10);
        assertTrue(sent);
        assertGt(this.balanceOf(bob), this.balanceOf(alice));
    }

    // function testStakeInit() public {
    //     // check we can interact with contract
    //     assertTrue(stakeContract.digramWallet() == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);
    // }

    // function testCreatePool() public {
    //     // TODO
    //     // check we can create staking pool
    // }
    // function testFailCreatePool() public {
    //     // TODO
    //     // check for create staking pool failure
    // }
    
    // function testAddVoter() public {
    //     // TODO
    //     // check we can add voter to staking pool
    // }
    
    // function testFailAddVoter() public {
    //     // TODO
    //     // check for adding voter to invalid staking pool

    //     // TODO
    //     // check for failure on adding voter to expired (?) staking pool

    //     // TODO
    //     // check for failure on adding voter twice
    // }

    // function testAddVote() public {
    //     // TODO
    //     // test for successful vote for already added voter in pool

    //     // TODO        
    //     // test for vote increment for repeated addVote calls for same voter

    //     // TODO
    //     // test for correct numberOfVotes for same voter across multiple pools
    // }    
    
    // function testFailAddVote() public {
    //     // TODO
    //     // test for failure if voter not in pool

    //     // TODO
    //     // test for failure if voter has insufficient funds
    // }    

    // function testQuadraticCost() public {
    //     // TODO
    //     // check that pool amount is 14 after one voter adds three votes

    //     // TODO
    //     // check that pool amount is 19 after one voter adds three votes, one voter adds two votes
    // }

    // function testPoolAllocation() public {
    //     // TODO
    //     // check winner is only voter

    //     // TODO
    //     // check winner is voter with wild majority of votes over another voter
    // }

    // function testFailPoolAllocation() public {        
    //     // TODO
    //     // check failure of allocation when pool does not exist
    //     // TODO
    //     // check failure of allocation when pool has no votes
    // }

    // function testChangeDigramWallet() public {
    //     // TODO
    //     // check we can change digram wallet
    // }

    // function testFailChangeDigramWallet() public {
    //     // TODO
    //     // check for digram wallet change failure from disallowed caller
    // }

}
