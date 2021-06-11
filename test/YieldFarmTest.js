const DolToken = artifacts.require("DolToken");
const AznToken = artifacts.require("AznToken");
const YieldFarm = artifacts.require("YieldFarm");
require("../client/node_modules/chai").use(require("../client/node_modules/chai-as-promised")).should();

const tokens = (t) => {
  return web3.utils.toWei(t, "ether");
};

contract("YieldFarm", ([owner, investor]) => {
  let dol, azn, farm;

  before(async () => {
    dol = await DolToken.new();
    azn = await AznToken.new();
    farm = await YieldFarm.new(dol.address, azn.address);

    await azn.transfer(farm.address, tokens("1000000"));
    await dol.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Dol token deployment", async () => {
    it("has a name", async () => {
      const name = await dol.name();
      assert.equal(name, "DOLLAR Test Token");
    });
  });

  describe("Azn token deployment", async () => {
    it("has a name", async () => {
      const name = await azn.name();
      assert.equal(name, "AZN Test Token");
    });
  });

  describe("Yield farm deployment", async () => {
    it("has a name", async () => {
      const name = await farm.name();
      assert.equal(name, "Yield Farm");
    });
    it("contract has tokens", async () => {
      let balance = await azn.balanceOf(farm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking DOL tokens", async () => {
      let result;
      result = await dol.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor DOL wallet balance correct before staking");
      await dol.approve(farm.address, tokens("100"), { from: investor });
      await farm.stakeTokens(tokens("100"), { from: investor });
      result = await dol.balanceOf(investor);
      assert.equal(result.toString(), tokens("0"), "investor DOL wallet balance correct after staking");
      result = await dol.balanceOf(farm.address);
      assert.equal(result.toString(), tokens("100"), "yield farm DOL balance correct after staking");
      result = await farm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("100"), "investor staking balance correct after staking");

      await farm.issueTokens({ from: owner });
      result = await azn.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor AZN wallet balance correct after issuing tokens");
      await farm.issueTokens({ from: investor }).should.be.rejected;

      await farm.unstakeTokens({ from: investor });
      result = await dol.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor DOL wallet balance correct after unstaking tokens");
      result = await dol.balanceOf(farm.address);
      assert.equal(result.toString(), tokens("0"), "yield farm DOL balance correct after unstaking tokens");
      result = await farm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("0"), "investor staking balance correct after unstaking");
      result = await farm.isStaking(investor);
      assert.equal(result.toString(), "false", "investor staking status correct after unstaking");
    });
  });
});
