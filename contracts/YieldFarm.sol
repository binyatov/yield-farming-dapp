pragma solidity >=0.4.21 <0.7.0;

import "./DolToken.sol";
import "./AznToken.sol";

contract YieldFarm {

    string public name = "Yield Farm";
    DolToken public dolToken;
    AznToken public aznToken;
    
    constructor(DolToken _dolToken, AznToken _aznToken) public {
        dolToken = _dolToken;
        aznToken = _aznToken;
    }
}