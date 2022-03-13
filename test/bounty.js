const { idText } = require("typescript");

const BountyFactory = artifacts.require("BountyFactory");

var ethers = require("ethers");

contract('BountyFactory', accounts => {
    const creatorAddress = accounts[0];
    const firstOwnerAddress = accounts[1];
    const secondOwnerAddress = accounts[2];
    const externalAddress = accounts[3];
    const unprivilegedAddress = accounts[4]

    before(async () => {
        this.bountyFactory = await BountyFactory.deployed();
    });

    it('should deploy successfully', async () => {
        assert.notEqual(creatorAddress, 0x0);
        assert.notEqual(creatorAddress, '');
        assert.notEqual(creatorAddress, null);
        assert.notEqual(creatorAddress, undefined);       
    });

    it('test if the factory creation works', async () => {
        let now = Math.floor((new Date).getTime() / 1000);
        const bountyFactory = await BountyFactory.new();
        await bountyFactory.newBounty(
            firstOwnerAddress, creatorAddress, now
        );
        let creatorWallets = await bountyFactory.getWallets.call(creatorAddress);
        assert(1 == creatorWallets.length);
    });
});