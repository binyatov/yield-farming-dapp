var AznToken = artifacts.require("./AznToken.sol");

module.exports = function (deployer) {
  deployer.deploy(AznToken);
};
