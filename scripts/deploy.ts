import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy PATA Token
  const pataToken = await ethers.deployContract("PataToken", [deployer.address]);
  await pataToken.waitForDeployment();
  const pataTokenAddress = await pataToken.getAddress();
  console.log("PataToken deployed to:", pataTokenAddress);

  // Deploy Reward NFT
  const rewardNFT = await ethers.deployContract("RewardNFT", [deployer.address]);
  await rewardNFT.waitForDeployment();
  const rewardNFTAddress = await rewardNFT.getAddress();
  console.log("RewardNFT deployed to:", rewardNFTAddress);

  // Deploy Staking Contract
  const stakingContract = await ethers.deployContract("StakingContract", [
    pataTokenAddress,
    rewardNFTAddress
  ]);
  await stakingContract.waitForDeployment();
  const stakingContractAddress = await stakingContract.getAddress();
  console.log("StakingContract deployed to:", stakingContractAddress);

  // Print configuration for web3.ts
  console.log("\nUpdate your web3.ts with these addresses:");
  console.log(`
export const PATA_TOKEN_ADDRESSES = {
  [base.id]: '${pataTokenAddress}',
  [baseSepolia.id]: '${pataTokenAddress}'
}

export const REWARD_NFT_ADDRESSES = {
  [base.id]: '${rewardNFTAddress}',
  [baseSepolia.id]: '${rewardNFTAddress}'
}

export const STAKING_CONTRACT_ADDRESSES = {
  mainnet: '${stakingContractAddress}',
  testnet: '${stakingContractAddress}'
}
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 