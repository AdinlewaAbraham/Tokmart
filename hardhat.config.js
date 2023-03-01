require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/fTNPemna1uNKbWTBBSjLpARvXtrpS2MY",
      accounts: [
        "c151d69465019938b74ed94b6192e97b84e93e8a04480f5aab132a65c10e5665",
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
