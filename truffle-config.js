var HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = 'timber stage music bid rubber skin nasty dismiss visit blind toddler cup';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, "https://polygon-mumbai.g.alchemy.com/v2/lmfvnrDaU4fzKJ_VldSaxl6N5hAdXlSC"),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 10000,
      networkCheckTimeout: 999999,
      skipDryRun: true,
      websocket: true,
      gas: 5000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, "https://speedy-nodes-nyc.moralis.io/0af77d64efeed8d6800cfaa0/eth/rinkeby"),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 10000,
      networkCheckTimeout: 999999,
      skipDryRun: true,
      websocket: true,
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  },
};
