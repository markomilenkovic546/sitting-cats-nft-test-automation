## Introduction

**Sitting Cats NFT**: [sitting-cats-nft.vercel.app](https://sitting-cats-nft.vercel.app/)

**Smart Contract Address**: 0x6c43832CE6604a3884d2f2cf18501beE9555d58B


The idea behind working on this project was to create an automation testing concept for the 'Sitting Cats NFT' minting application by utilizing the **Synpress** testing framework which is based on Cypress with support for MetaMask. 
Additionally, the **ethers.js** library was utilized as a dependency for the purpose of calling functions on the smart contract in order to verify the communication of the React application with the smart contract.

The framework is designed in the Page Object Model (POM). Also, in the `support.js` file, custom commands and custom utility functions are created as an additional abstraction layer.

## Running Locally

To run the project locally, follow these steps:

1. Clone the project locally.
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file in the root directory (check `.env.example` in the project root to see what needs to be included).
4. Create a `cypress.env.json` file in the root directory (check `cypress.env.json` in the project root to see what needs to be included. You only have to change "account 1" value).

**Note:** In order to isolate test cases, tests are executing using multiple MetaMask accounts. So that requires setting the specific balance on every account. 
You must create 11 accounts, and make sure that every account, except account 2, has enough Polygon Mumbai Matics to mint several NFTs and pay the gas fee.

## Available Scripts

- To run individual test suites: `npm run synpress`
- To run individual test suites/spec files:
  - `npm run auth`
  - `npm run balance-checker`
  - `npm run minting-logic`
  - `npm run collection-showcase`
 
