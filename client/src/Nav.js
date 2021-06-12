import React from "react";

const Nav = (props) => {
  return (
    <div className="app-nav">
      <div className="app-nav-wrap">
        <span>DEFI DAPP</span>
        <span>{props.account}</span>
      </div>
    </div>
  );
};

export default Nav;
