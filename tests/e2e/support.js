import '@synthetixio/synpress/support/index';

Cypress.Commands.add('formatAddress', (address) => {
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);
    const shortenedAddress = `${firstPart}...${lastPart}`;
    return shortenedAddress;
 })
