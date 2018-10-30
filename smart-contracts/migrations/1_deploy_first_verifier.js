var TenVerifier = artifacts.require("./TenVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(TenVerifier);
};
