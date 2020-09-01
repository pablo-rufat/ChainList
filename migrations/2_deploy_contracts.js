var ChainList = artifacts.require("./chainlist.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainList);
};
