//const hre = require("hardhat");
const { ethers } = require("hardhat");


async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
      
    //console.log("Account balance:", (await deployer.getBalance()).toString());
     
    const maxTokensPerAddress = 10;
    const mintingPrice = ethers.utils.parseEther("0.01"); // Set minting price to 0.01 ETH
    const useWhitelist = false;

   const Atriv = await ethers.getContractFactory("Atriv");
   const atriv = await Atriv.deploy("MyTokenName", "MTN", "https://api.example.com/metadata/", 1000, maxTokensPerAddress, mintingPrice, useWhitelist);

    console.log("Atriv address:", atriv.address);

   /*
    ////////////////////////////////////////////////////////////////


   // const maxTokensPerAddress = 10;
   // const mintingPrice = ethers.utils.parseEther("0.01"); // Set minting price to 0.01 ETH
   // const useWhitelist = true;
    const dollarPriceWeiCost = ethers.utils.parseEther("1000"); // You need to define its value
    const baseURI = "https://api.example.com/metadata/";
    const maxSupply = 1000;
    
    // Retrieve the contract factory
    const AtrivMultiChain = await ethers.getContractFactory("AtrivMultiChainNFT");
    
    // Deploy the contract
    const atrivMultiChain = await AtrivMultiChain.deploy(
        "MyTokenName", 
        "MTN", 
        baseURI, 
        maxSupply, 
        maxTokensPerAddress, 
        mintingPrice, 
        useWhitelist, 
        dollarPriceWeiCost
    );

    await atrivMultiChain.deployed();

    console.log("AtrivMultiChainNFT deployed to:", atrivMultiChain.address);

    */
}

/// 0xda78c4aFA67632b481ab980364521C2AA0E2D5C7

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });










/*

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
*/