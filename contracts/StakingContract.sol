// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingContract is Ownable, ReentrancyGuard {
    IERC20 public pataToken;
    uint256 public constant APY = 5; // 5% APY
    uint256 public constant REWARD_RATE = APY * 1e18 / 365 days; // Daily reward rate

    struct Staker {
        uint256 amount;
        uint256 lastRewardTime;
        uint256 rewards;
    }

    mapping(address => Staker) public stakers;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _pataToken) Ownable(msg.sender) {
        pataToken = IERC20(_pataToken);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Update rewards before staking
        _updateRewards(msg.sender);
        
        // Transfer tokens from user
        require(pataToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update staker info
        stakers[msg.sender].amount += amount;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }

    function unstake() external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "No tokens staked");
        
        // Update rewards before unstaking
        _updateRewards(msg.sender);
        
        uint256 amount = staker.amount;
        staker.amount = 0;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        require(pataToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);
        
        uint256 rewards = stakers[msg.sender].rewards;
        require(rewards > 0, "No rewards to claim");
        
        stakers[msg.sender].rewards = 0;
        
        // Transfer rewards to user
        require(pataToken.transfer(msg.sender, rewards), "Transfer failed");
        
        emit RewardsClaimed(msg.sender, rewards);
    }

    function _updateRewards(address user) internal {
        Staker storage staker = stakers[user];
        if (staker.amount == 0) return;
        
        uint256 timeElapsed = block.timestamp - staker.lastRewardTime;
        uint256 rewards = (staker.amount * REWARD_RATE * timeElapsed) / 1e18;
        
        staker.rewards += rewards;
        staker.lastRewardTime = block.timestamp;
    }

    function getStakedBalance(address user) external view returns (uint256) {
        return stakers[user].amount;
    }

    function getRewards(address user) external view returns (uint256) {
        Staker storage staker = stakers[user];
        if (staker.amount == 0) return staker.rewards;
        
        uint256 timeElapsed = block.timestamp - staker.lastRewardTime;
        uint256 pendingRewards = (staker.amount * REWARD_RATE * timeElapsed) / 1e18;
        
        return staker.rewards + pendingRewards;
    }
} 