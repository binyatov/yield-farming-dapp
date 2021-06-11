const DolToken = artifacts.require("./DolToken.sol");
const AznToken = artifacts.require("./AznToken.sol");
const YieldFarm = artifacts.require("./YieldFarm.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(DolToken);
  const dol = await DolToken.deployed();
  await deployer.deploy(AznToken);
  const azn = await AznToken.deployed();
  await deployer.deploy(YieldFarm, dol.address, azn.address);
  const farm = await YieldFarm.deployed();
  await azn.transfer(farm.address, "1000000000000000000000000");
  await dol.transfer(accounts[1], "100000000000000000000");
};
