// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy } = deployments;
   const { deployer } = await getNamedAccounts();

   await deploy("lostandfound_vol_1", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: deployer,
      args: ["ipfs://bafybeifid5lbfcumbhpnr6dgikdg25vkr62lmc4uv4xyhzboskjqjsz474/"],
      log: true,
   });
};
module.exports.tags = ["lostandfound_vol_1"];