require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/fTNPemna1uNKbWTBBSjLpARvXtrpS2MY",
      accounts: [
        "24b0f568023726edc55da5272794d65d97b32d2af5fc52251b865ad755601863",
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
