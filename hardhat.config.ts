import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-abi-exporter";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";
import 'hardhat-deploy';

const avaxFujiKey = '';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000
          }
        }
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000
          }
        }
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000
          }
        }
      },

    ]
  },
  namedAccounts: {
    deployer: 0,
    poster: '0x52f428419bFf2668a1416f1aB0776163BC8F8731',
    admin: {
      buidlerevm_docker: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      hardhat: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      fuji: '0x52f428419bFf2668a1416f1aB0776163BC8F8731'
    },
  },
  // abiExporter: {
  //   path: './next-front/front/components/eth/abi',
  //   runOnCompile: true,
  //   clear: true,
  //   flat: false,
  //   pretty: false,
  // },
  networks: {
    hardhat: {
      // chainId: 31337,
      gasPrice: 225000000000,
    },
    buidlerevm_docker: {
      url: "http://localhost:8545",
      gasPrice: 8000000000,
      chainId: 31337,
      gasMultiplier: 2
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [`0x${avaxFujiKey}`]
    },
  },
}

export default config;
