import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const pataToken = await ethers.deployContract("PataToken", [deployer.address]);
  await pataToken.waitForDeployment();

  console.log("PataToken deployed to:", await pataToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 