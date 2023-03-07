require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/fTNPemna1uNKbWTBBSjLpARvXtrpS2MY",
      accounts: [
        "YOUR_PRIVATE_KEY",
      ],
      hardhat: {
        chainId: 1337
      }
    },
    ganache: {
      url: "HTTP://127.0.0.1:8545",
      accounts: [
        "YOUR_PRIVATE_KEY",
      ],
      hardhat: {
        chainId: 1337
      }
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
};
