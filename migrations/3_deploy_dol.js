var DolToken = artifacts.require("./DolToken.sol");

module.exports = function (deployer) {
  deployer.deploy(DolToken);
};
