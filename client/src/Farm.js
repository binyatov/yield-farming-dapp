import React, { Component } from "react";
import dicon from "./dol.png";

class Farm extends Component {
  render() {
    return (
      <div className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: "500px" }}>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.web3.utils.fromWei(this.props.stakingBalance, "ether")} DOL</td>
              <td>{this.props.web3.utils.fromWei(this.props.aznBalance, "ether")} AZN</td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-4">
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = this.props.web3.utils.toWei(amount, "ether");
                this.props.stakeTokens(amount);
              }}
            >
              <div>
                <label className="float-left">
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right text-muted">
                  Balance: {this.props.web3.utils.fromWei(this.props.dolBalance, "ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => {
                    this.input = input;
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dicon} height="30" alt="" />
                    &nbsp;DOL
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                Stake tokens
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault();
                this.props.unstakeTokens();
              }}
            >
              Unstake tokens
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Farm;
