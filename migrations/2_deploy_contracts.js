const ERC20 = artifacts.require("ERC20");
const BountyFactory = artifacts.require("BountyFactory");
const Clones = artifacts.require("Clones");
const StakeFactory = artifacts.require("StakeFactory");

module.exports = function(deployer) {
  deployer.deploy(ERC20, 'Digram', 'DGRM');
  deployer.deploy(BountyFactory);
  deployer.deploy(Clones);
  deployer.deploy(StakeFactory);
};
