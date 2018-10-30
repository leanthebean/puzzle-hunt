var TenVerifier = artifacts.require("./TenVerifier.sol");
var MagicVerifier = artifacts.require("./MagicVerifier.sol");
var NFTPrize = artifacts.require("./NFTPrize.sol");

let tokenImageForAddingTen = 'https://i.imgur.com/bHVMwAj.png'
let tokenImageForMagicNumber = 'https://i.imgur.com/Ye7YFfX.png'

module.exports = function(deployer) {
  deployer.deploy(NFTPrize).then(function(instance) { 
    instance.addPuzzle(TenVerifier.address, tokenImageForAddingTen)
    instance.addPuzzle(MagicVerifier.address, tokenImageForMagicNumber)
  });
};
