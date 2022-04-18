// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy } = deployments;
   const { deployer } = await getNamedAccounts();

   await deploy("lostandfound_vol_1_v6", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: deployer,
      args: ["ipfs://bafybeif33aarvtthtms5sbxgg5ujvrdr4liop7xnahb7u7aw4smxo2yuqe/"],
      log: true,
   });
};
module.exports.tags = ["lostandfound_vol_1_v6"];