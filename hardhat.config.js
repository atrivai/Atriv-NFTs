require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    
    hardhat: {
    },
    coston: {
      url: "https://coston-api.flare.network/ext/C/rpc",
      accounts: []
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

//require("@nomiclabs/hardhat-waffle");
/*
module.exports = {
  networks: {
    hardhat: {
    },
  },
  solidity: "0.8.17",
};
*/
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
};
