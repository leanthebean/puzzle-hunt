var MagicVerifier = artifacts.require("./MagicVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(MagicVerifier);
};
