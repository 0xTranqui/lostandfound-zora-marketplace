// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy } = deployments;
   const { deployer } = await getNamedAccounts();

   await deploy("lostandfound_vol_1_v5", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: deployer,
      args: ["ipfs://bafybeif7iqjd5axwazni55zh742cgrr6d4udoos5ecgcb5rwbjtr6k6gxm/"],
      log: true,
   });
};
module.exports.tags = ["lostandfound_vol_1_v5"];