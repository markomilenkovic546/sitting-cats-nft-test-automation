import '@synthetixio/synpress/support/index';

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

