// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Bounty.sol";
import "../lib/forge-std/src/Test.sol";
import "../lib/forge-std/src/console2.sol";

contract BountyTest is Test {
    Bounty public bountyContract;

    address public owner;
    address public addr1;
    address public addr2;
    
    function setUp() public {
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
