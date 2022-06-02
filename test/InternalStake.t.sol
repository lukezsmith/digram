// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "../src/Stake.sol";
import "./mocks/LinkToken.sol";
import "./mocks/MockVRFCoordinatorV2.sol";
import {DGRM} from "../src/DGRM.sol";
import {console} from "forge-std/console.sol";
import {stdStorage, StdStorage, Test, Vm} from "forge-std/Test.sol";
import {DSTest} from "ds-test/test.sol";
import {Utilities} from "./utils/Utilities.sol";

//import VRF
// import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import "@solmate/tokens/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract InternalStake is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;

    // address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    // address link_token_contract = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    // bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    // uint32 numWords =  1;
    
    // Storage parameters
    uint64 immutable s_subscriptionId;
    bytes32 immutable s_keyHash;
    uint32 immutable s_callbackGasLimit = 100000;
    uint16 immutable s_requestConfirmations = 3;
    uint32 public immutable s_numWords = 1;
    uint256 public s_requestId;
    uint256[] public s_randomWords;
    address s_owner;

    uint256[] public poolIds;

    ERC20 private _token;
    uint256 public _pool;
    uint256 public denomination;
    uint256 public maxEntries;

    address public digramWallet = 0x44BBa8F36Be0BB08e9680f046F109aA2b4aCf391;

    struct Pool {
        uint256 poolAmount;
        bool poolExists;
        Voter[] poolVoters;
        mapping(address => Voter) voters;
        address[] voterAddresses;
    }

    mapping(uint256 => Pool) public pools;
    mapping(uint256 => uint256) public poolIdFromRequestId;

    struct Voter {
        address voterAddress;
        uint256 numberVotes;
        uint256 index;
    }

    modifier onlyOwner() {
        require(msg.sender == digramWallet);
        _;
    }

    constructor(ERC20 __token, 
                uint64 subscriptionId,
                address vrfCoordinator,
                address link,
                bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        _token = __token;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_keyHash = keyHash;
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    // // Create a new subscription when the contract is initially deployed.
    // function createNewSubscription() private onlyOwner {
    //     // Create a subscription with a new subscription ID.
    //     address[] memory consumers = new address[](1);
    //     consumers[0] = address(this);
    //     s_subscriptionId = COORDINATOR.createSubscription();
    //     // Add this contract as a consumer of its own subscription.
    //     COORDINATOR.addConsumer(s_subscriptionId, consumers[0]);
    // }

    // function addConsumer(address consumerAddress) external onlyOwner {
    //     // Add a consumer contract to the subscription.
    //     COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
    // }

    // function removeConsumer(address consumerAddress) external onlyOwner {
    //     // Remove a consumer contract from the subscription.
    //     COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    // }

    // function cancelSubscription(address receivingWallet) external onlyOwner {
    //     // Cancel the subscription and send the remaining LINK to a wallet address.
    //     COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
    //     s_subscriptionId = 0;
    // }

    function token() public view returns (ERC20) {
        return _token;
    }

    function setDenomination(uint256 denom) public onlyOwner returns (bool) {
        denomination = denom;
        return true;
    }

    function getDenomination() public view returns (uint256) {
        return denomination;
    }

    function getPoolAmount(uint256 poolId) public view returns (uint256) {
        return pools[poolId].poolAmount;
    }

    function createPool(uint256 poolId) public onlyOwner returns (bool) {
        Pool storage newPool = pools[poolId];
        newPool.poolAmount = 0;
        newPool.poolExists = true;
        return true;
    }

    function addVote(uint256 poolId) public returns (bool) {
        // memory or storage here?
        Pool storage pool = pools[poolId];
        // require(pool.poolExists);
        if (
            pool.voters[msg.sender].voterAddress ==
            0x0000000000000000000000000000000000000000
        ) {
            Voter storage newVoter = pools[poolId].voters[msg.sender];
            newVoter.voterAddress = msg.sender;
            newVoter.numberVotes = 1;
            pools[poolId].poolVoters.push(newVoter);
            pool.voterAddresses.push(msg.sender);
        } else {
            pool.voters[msg.sender].numberVotes += 1;
        }
        uint256 cost = getCost(poolId, msg.sender);
        token().transferFrom(msg.sender, address(this), cost);
        updatePool(poolId, cost);
        return true;
    }

    function updatePool(uint256 poolId, uint256 amount)
        internal
        returns (bool)
    {
        pools[poolId].poolAmount += amount;
        return true;
    }

    function getCost(uint256 poolId, address voterAddress)
        internal
        view
        returns (uint256)
    {
        require(pools[poolId].poolExists);
        uint256 currentCost;
        currentCost = (pools[poolId].voters[voterAddress].numberVotes)**2;
        return currentCost;
    }

    function requestRandomWords(uint256 poolId) public {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            s_requestConfirmations,
            s_callbackGasLimit,
            s_numWords
        );
        poolIdFromRequestId[s_requestId] = poolId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        s_randomWords = randomWords;

        // get pool from requestId
        uint256 poolId = poolIdFromRequestId[requestId];
        
        // distribute staking pool funds 
        // DISABLED FOR INTERNAL TESTING
        // allocatePool(poolId, randomWords);
    }

    function requestWinner(uint256 poolId) public onlyOwner returns (bool){
        Pool storage pool = pools[poolId];
        require(pool.poolExists);
        // generate index via ChainLink VRF
        // DISABLED FOR INTERNAL TESTING
        // requestRandomWords(poolId);
        return true;
    }

    function allocatePool(uint256 poolId, uint256[] memory randomWords) public returns (bool) {
        Pool storage pool = pools[poolId];
        uint256 index = (randomWords[0] % pool.voterAddresses.length );
        address winner = pool.voterAddresses[index];  
        token().transfer(winner, pool.poolAmount);
        return true;
    }

    function setDigramWallet(address wallet) public onlyOwner returns (bool) {
        digramWallet = wallet;
        return true;
    }

    function withdraw(uint256 amount, address to, bool isDGRMWithdrawal ) external onlyOwner returns (bool) {
        if (isDGRMWithdrawal){
            token().transfer(to, amount);
        } else  {
            LINKTOKEN.transfer(to, amount);
        }
        return true;
    }
}


contract InternalStakeTest is DSTest, DGRM {
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

    InternalStake public stakeContract;

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
        stakeContract = new InternalStake(
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

        // mint DGRM to first alice, bob users
        _mint(alice, 100);
        _mint(bob, 100);

    }
    function testRandomWordResponse() public {
        // test random words are generated 
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(69));
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(69));
        assertEq(stakeContract.getPoolAmount(69), 1);
        vm.stopPrank();
        vm.startPrank(digramWallet);
        assertEq(this.balanceOf(address(stakeContract)), 1);
        assertEq(this.balanceOf(alice), 99);

        stakeContract.requestWinner(69);
        stakeContract.requestRandomWords(69);
        uint256 requestId = stakeContract.s_requestId();

        uint256[] memory words = getWords(requestId);

        vrfCoordinator.fulfillRandomWords(requestId, address(stakeContract));
        assertTrue(stakeContract.s_randomWords(0) == words[0]);
    }
    function testPoolAllocation() public {
        // check winner is only voter
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(69));
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(69));
        assertEq(stakeContract.getPoolAmount(69), 1);
        vm.stopPrank();
        vm.startPrank(digramWallet);
        assertEq(this.balanceOf(address(stakeContract)), 1);
        assertEq(this.balanceOf(alice), 99);

        stakeContract.requestWinner(69);
        stakeContract.requestRandomWords(69);
        uint256 requestId = stakeContract.s_requestId();

        uint256[] memory words = getWords(requestId);

        vrfCoordinator.fulfillRandomWords(requestId, address(stakeContract));
        vm.stopPrank();
        vm.prank(address(stakeContract));
        assertTrue(stakeContract.allocatePool(69, words));
        
        // check balances
        assertEq(this.balanceOf(address(stakeContract)), 0);
        assertEq(this.balanceOf(alice), 100);

        vm.stopPrank();

        // check winner is voter with wild majority of votes over another voter
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(49));
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(49));
        assertTrue(stakeContract.addVote(49));
        assertTrue(stakeContract.addVote(49));
        assertTrue(stakeContract.addVote(49));
        assertTrue(stakeContract.addVote(49));
        assertEq(stakeContract.getPoolAmount(49), 55);
        vm.stopPrank();
        vm.startPrank(bob);
        assertTrue(stakeContract.addVote(49));
        assertEq(stakeContract.getPoolAmount(49), 56);
        vm.stopPrank();
        vm.startPrank(digramWallet);
        assertEq(this.balanceOf(address(stakeContract)), 56);
        assertEq(this.balanceOf(alice), 45);

        stakeContract.requestWinner(49);
        stakeContract.requestRandomWords(49);
        requestId = stakeContract.s_requestId();

        words = getWords(requestId);

        vrfCoordinator.fulfillRandomWords(requestId, address(stakeContract));
        vm.stopPrank();
        vm.prank(address(stakeContract));
        assertTrue(stakeContract.allocatePool(49, words));
        
        // check balances
        assertEq(this.balanceOf(address(stakeContract)), 0);
        assertTrue(this.balanceOf(alice) == 45 || this.balanceOf(alice) == 101);
        assertTrue(this.balanceOf(bob) == 99 || this.balanceOf(bob) == 155);
    }

    function testFailPoolAllocationInvalidPool() public {        
        // TODO
        // check failure of allocation when pool does not exist
        vm.prank(digramWallet);
        assertTrue(stakeContract.createPool(69));
        vm.startPrank(alice);
        assertTrue(stakeContract.addVote(69));
        assertEq(stakeContract.getPoolAmount(69), 1);
        vm.stopPrank();
        vm.startPrank(digramWallet);
        assertEq(this.balanceOf(address(stakeContract)), 1);
        assertEq(this.balanceOf(alice), 99);

        stakeContract.requestWinner(69);
        stakeContract.requestRandomWords(69);
        uint256 requestId = stakeContract.s_requestId();

        uint256[] memory words = getWords(requestId);

        vrfCoordinator.fulfillRandomWords(requestId, address(stakeContract));
        vm.stopPrank();
        vm.prank(address(stakeContract));
        assertTrue(stakeContract.allocatePool(99, words));
    }

    function testFailPoolAllocationNoVotes() public {        
        // TODO
        // check failure of allocation when pool has no votes
        vm.startPrank(digramWallet);
        assertTrue(stakeContract.createPool(19));
        stakeContract.requestWinner(19);
        stakeContract.requestRandomWords(19);
        uint256 requestId = stakeContract.s_requestId();

        uint256[] memory words = getWords(requestId);

        vrfCoordinator.fulfillRandomWords(requestId, address(stakeContract));
        vm.stopPrank();
        vm.prank(address(stakeContract));
        assertTrue(stakeContract.allocatePool(99, words));
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
