pragma solidity >=0.4.21 <0.7.0;

import "./DolToken.sol";
import "./AznToken.sol";

contract YieldFarm {

    string public name = "Yield Farm";
    DolToken public dolToken;
    AznToken public aznToken;
    address public owner;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    address[] public stakers;
    
    constructor(DolToken _dolToken, AznToken _aznToken) public {
        dolToken = _dolToken;
        aznToken = _aznToken;
        owner = msg.sender;
    }

    //Deposit money - stake tokens to dapp
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount can not be 0");
        dolToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //Reward investors - issue AZN tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                aznToken.transfer(recipient, balance);
            }
            
        }
    }

    //Remowe deposit - unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance can not be 0");
        dolToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

}