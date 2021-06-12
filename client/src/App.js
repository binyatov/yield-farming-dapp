import React, { Component } from "react";
import YieldFarm from "./contracts/YieldFarm.json";
import DolToken from "./contracts/DolToken.json";
import AznToken from "./contracts/AznToken.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Nav from "./Nav";
import Farm from "./Farm";
import spinner from "./spinner.gif";

class App extends Component {
  state = {
    web3: null,
    account: "0x0",
    dol: {},
    azn: {},
    farm: {},
    dolBalance: "0",
    aznBalance: "0",
    stakingBalance: "0",
    loading: true,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      this.setState({ web3 });
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();

      const dolDeployed = DolToken.networks[networkId];
      if (dolDeployed) {
        const dol = new web3.eth.Contract(DolToken.abi, dolDeployed.address);
        this.setState({ dol });
        let dolBalance = await dol.methods.balanceOf(this.state.account).call();
        this.setState({ dolBalance: dolBalance.toString() });
      } else {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      }

      const aznDeployed = AznToken.networks[networkId];
      if (aznDeployed) {
        const azn = new web3.eth.Contract(AznToken.abi, aznDeployed.address);
        this.setState({ azn });
        let aznBalance = await azn.methods.balanceOf(this.state.account).call();
        this.setState({ aznBalance: aznBalance.toString() });
      } else {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      }

      const farmDeployed = YieldFarm.networks[networkId];
      if (farmDeployed) {
        const farm = new web3.eth.Contract(YieldFarm.abi, farmDeployed.address);
        this.setState({ farm });
        let balance = await farm.methods.stakingBalance(this.state.account).call();
        this.setState({ stakingBalance: balance.toString() });
      } else {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      }
      this.setState({ loading: false });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.dol.methods
      .approve(this.state.farm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.farm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  unstakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.farm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div>
        <Nav account={this.state.account} />
        <div className="app-main">
          {this.state.loading ? (
            <img className="spinner" alt="spinner" src={spinner} />
          ) : (
            <Farm
              dolBalance={this.state.dolBalance}
              aznBalance={this.state.aznBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens={this.stakeTokens}
              unstakeTokens={this.unstakeTokens}
              web3={this.state.web3}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
