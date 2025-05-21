import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Get contract instances using the deployed addresses
  const pataToken = await ethers.getContractAt("PataToken", "YOUR_DEPLOYED_PATA_TOKEN_ADDRESS");
  const rewardNFT = await ethers.getContractAt("RewardNFT", "YOUR_DEPLOYED_REWARD_NFT_ADDRESS");

  // Mint some PATA tokens
  const mintAmount = ethers.parseEther("1000"); // 1000 PATA tokens
  await pataToken.mint(deployer.address, mintAmount);
  console.log(`Minted ${ethers.formatEther(mintAmount)} PATA tokens to ${deployer.address}`);

  // Mint a test NFT
  await rewardNFT.mintReward(deployer.address);
  console.log(`Minted a reward NFT to ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
