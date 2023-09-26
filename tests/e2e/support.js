import '@synthetixio/synpress/support/index';
const ethers = require("ethers");
const abi = require("./abi.json");

Cypress.Commands.add('formatAddress', (address) => {
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);
    const shortenedAddress = `${firstPart}...${lastPart}`;
    return shortenedAddress;
 })


 Cypress.Commands.add('getAllowedNumberToMint', (text) => {
    const numbers = text.match(/\d+/g); 
    const firstNumber = numbers[0];
    const allowedNumber = 7 - Number(firstNumber)
    return allowedNumber
 })

 // To call the function on smart contract to get owner of the NFT 
async function getNftOwner(nftId) {
   const contractAddress = Cypress.env("scAddress");
   const provider = new ethers.providers.WebSocketProvider(Cypress.env("providerURL"))
   const contract = new ethers.Contract(contractAddress, abi, provider);
   try {
     const readOwner = await contract.ownerOf(nftId);
     console.log(readOwner);
     console.log(typeof readOwner);
     return readOwner;
   } catch (error) {
     console.error(error);
     return readOwner
   }
 }
 
// Call the function on smart contract to get owner of the NFT by passing NFT id as an parameter
 Cypress.Commands.add('getNftOwner', (nftId) => {
   return getNftOwner(nftId);
 });
 

