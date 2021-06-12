const YieldFarm = artifacts.require("YieldFarm");

module.exports = async (callback) => {
  let farm = await YieldFarm.deployed();
  await farm.issueTokens();
  console.log("Tokens issued");
  callback();
};
