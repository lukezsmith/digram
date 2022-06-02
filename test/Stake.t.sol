// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Stake.sol";
import "./mocks/LinkToken.sol";
import "./mocks/MockVRFCoordinatorV2.sol";
import {DGRM} from "../src/DGRM.sol";
import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test, Vm} from "forge-std/Test.sol";
import {DSTest} from "ds-test/test.sol";
import {Utilities} from "./utils/Utilities.sol";

contract StakeTest is DGRM, DSTest {
    LinkToken public linkToken;
    MockVRFCoordinatorV2 public vrfCoordinator;
    Vm internal immutable vm = Vm(HEVM_ADDRESS);

    Utilities internal utils;
    address payable[] internal users;
    address payable alice;
    address payable bob;
    address payable digramWallet = payable(0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);

    uint96 constant FUND_AMOUNT = 1 * 10**18;

    // Initialized as blank, fine for testing
    uint64 subId;
    bytes32 keyHash; // gasLane

    event ReturnedRandomness(uint256[] randomWords);

    Stake public stakeContract;

    function setUp() public {
        // create test users
        utils = new Utilities();
        users = utils.createUsers(5);

        // VRF setup
        linkToken = new LinkToken();
        vrfCoordinator = new MockVRFCoordinatorV2();
        subId = vrfCoordinator.createSubscription();
        vrfCoordinator.fundSubscription(subId, FUND_AMOUNT);

        // instantiate contract
        stakeContract = new Stake(
            this,
            subId,
            address(vrfCoordinator),
            address(linkToken),
            keyHash
        );

        // labels alice/bob address in call traces as "Alice [<address>]"
        alice = users[0];
        vm.label(alice, "Alice");
        bob = users[1];
        vm.label(bob, "Bob");

        // allocate DGRM to digramWallet
        vm.deal(digramWallet, 100 ether);
        _mint(digramWallet, 100);

        // approve unlimited spending in stake contract for alice, bob and digram
        vm.prank(alice);
        this.approve(address(stakeContract),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        vm.prank(bob);
        this.approve(address(stakeContract),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        vm.prank(digramWallet);
        this.approve(address(stakeContract),0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
        // vm.prank(address(digramWallet));
        // this.approve(alice,0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

        // mint DGRM to first alice, bob users
        _mint(alice, 100);
        _mint(bob, 100);

    }

    function testDGRMTransfer() public {
        vm.prank(alice);
        bool sent  =  this.transfer(bob, 10);
        assertTrue(sent);
        assertGt(this.balanceOf(bob), this.balanceOf(alice));
    }

    function testStakeInit() public {
        // check we can interact with contract
        assertTrue(stakeContract.digramWallet() == 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391);
    }

    function testCreatePool() public {
        // check we can create staking pool
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(0));
        assertEq(stakeContract.getPoolAmount(0), 0);
    }
    function testFailCreatePool() public {
        // check for create staking pool failure
        vm.prank(alice);
        stakeContract.createPool(0);
    }

    function testAddVote() public {
        // test for successful votes and correct pool amounts 
        vm.prank(digramWallet);
        stakeContract.createPool(0);
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(0));
        assertEq(stakeContract.getPoolAmount(0), 1);
        assertTrue(stakeContract.addVote(0));
        assertEq(stakeContract.getPoolAmount(0), 5);
        assertTrue(stakeContract.addVote(0));
        assertEq(stakeContract.getPoolAmount(0), 14);
        vm.stopPrank();

        // test for multiple voters
        vm.prank(digramWallet);
        stakeContract.createPool(1);
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(1));
        assertEq(stakeContract.getPoolAmount(1), 1);
        assertTrue(stakeContract.addVote(1));
        assertEq(stakeContract.getPoolAmount(1), 5);
        vm.stopPrank();
        vm.startPrank(bob);
        assertTrue(stakeContract.addVote(1));
        assertEq(stakeContract.getPoolAmount(1), 6);
        vm.stopPrank();

        // test for correct numberOfVotes for same voter across multiple pools
        vm.startPrank(alice);
        assertEq(stakeContract.getPoolAmount(0), 14);
        assertEq(stakeContract.getPoolAmount(1), 6);
        vm.stopPrank();
    }    

    function testFailAddVoteInvalidPool() public {
        // test failure of vote to invalid pool
        vm.prank(alice);
        assertTrue(stakeContract.addVote(4));
    }
    
    function testFailAddVoteUserNotInPool() public {
        // test for failure if voter not in pool
        _mint(users[3], 100);
        vm.prank(users[3]);
        assertTrue(stakeContract.addVote(0));
    }

    function testFailAddVoteUserInsufficientFunds() public {
        // test for failure if voter has insufficient funds
        vm.prank(users[4]);
        assertTrue(stakeContract.addVote(0));
    }    

    function testQuadraticCost() public {
        // check that pool amount is 39 after one voter adds four votes, one voter adds two votes
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(69)); 
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(69));
        assertTrue(stakeContract.addVote(69));
        assertTrue(stakeContract.addVote(69));
        assertTrue(stakeContract.addVote(69));
        assertEq(stakeContract.getPoolAmount(69), 30);
        vm.stopPrank();
    }

    function testRequestWinner() public {
        // test request winner can be called
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(69));
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(69));
        assertEq(stakeContract.getPoolAmount(69), 1);
        vm.stopPrank();
        vm.startPrank(digramWallet);
        assertEq(this.balanceOf(address(stakeContract)), 1);
        assertEq(this.balanceOf(alice), 99);

        assertTrue(stakeContract.requestWinner(69));
        vm.stopPrank();
    }

    function testFailRequestWinnerNonOwner() public {
        // test request winner cannot be called by non-owner
        vm.prank(digramWallet);
        stakeContract.createPool(69);
        vm.startPrank(alice);
        stakeContract.addVote(69);
        assertTrue(stakeContract.requestWinner(69));
        vm.stopPrank();
    }

    function testFailRequestWinnerInvalidPool() public {
        // test request winner cannot be called on invalid pool
        vm.prank(digramWallet);
        stakeContract.createPool(69);
        vm.startPrank(alice);
        stakeContract.addVote(69);
        stakeContract.getPoolAmount(69);
        vm.stopPrank();
        vm.prank(digramWallet);
        assertTrue(stakeContract.requestWinner(99));
    }

    function testChangeDigramWallet() public {
        // check we can change digram wallet
        vm.prank(digramWallet);
        assertTrue(stakeContract.setDigramWallet(alice));
    }


    function testFailChangeDigramWallet() public {
        // check for digram wallet change failure from disallowed caller
        vm.prank(alice);
        assertTrue(stakeContract.setDigramWallet(bob));
    }

    function testWithdrawalDigram() public {        
        // check that DGRM can be withdrawn to the digram wallet
        vm.prank(alice);
        this.transfer(address(stakeContract), 10);

        assertEq(this.balanceOf(alice), 90);

        vm.prank(digramWallet);
        stakeContract.withdraw(digramWallet, 10, true);

        assertEq(this.balanceOf(digramWallet), 110);
    }

    function testWithdrawalOther() public {
        // check that DGRM can be withdrawn to another wallet
        vm.prank(alice);
        this.transfer(address(stakeContract), 10);

        assertEq(this.balanceOf(alice), 90);

        vm.prank(digramWallet);
        stakeContract.withdraw(alice, 10, true);

        assertEq(this.balanceOf(alice), 100);
    }

    function testFailWithdrawal() public {
        // check withdrawal failure after being called by non owner
        vm.prank(alice);
        this.transfer(address(stakeContract), 10);

        vm.prank(bob);
        assertTrue(stakeContract.withdraw(alice, 10, true));
    }

    function testFailWithdrawalFunds() public {
        // check withdrawal failure due to insufficient funds
        vm.prank(alice);
        this.transfer(address(stakeContract), 10);

        vm.prank(digramWallet);
        assertTrue(stakeContract.withdraw(alice, 20, true));
    }

    function getWords(uint256 requestId)
            public
            view
            returns (uint256[] memory)
        {
            uint256[] memory words = new uint256[](stakeContract.s_numWords());
            for (uint256 i = 0; i < stakeContract.s_numWords(); i++) {
                words[i] = uint256(keccak256(abi.encode(requestId, i)));
            }
            return words;
        }
}
