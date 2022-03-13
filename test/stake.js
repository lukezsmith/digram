const { idText } = require("typescript");

const StakeFactory = artifacts.require("StakeFactory");

var ethers = require("ethers");

contract('StakeFactory', accounts => {
    const creatorAddress = accounts[0];
    const firstOwnerAddress = accounts[1];
    const secondOwnerAddress = accounts[2];
    const externalAddress = accounts[3];
    const unprivilegedAddress = accounts[4]

    before(async () => {
        this.stakeFactory = await StakeFactory.deployed();
    });

    it('should deploy successfully', async () => {
        assert.notEqual(creatorAddress, 0x0);
        assert.notEqual(creatorAddress, '');
        assert.notEqual(creatorAddress, null);
        assert.notEqual(creatorAddress, undefined);       
    });

    it('test if the factory creation works', async () => {
        let now = Math.floor((new Date).getTime() / 1000);
        const stakeFactory = await StakeFactory.new();
        await stakeFactory.newStake(
            firstOwnerAddress, creatorAddress
        );
        let creatorWallets = await stakeFactory.getWallets.call(creatorAddress);
        assert(1 == creatorWallets.length);
    });
});