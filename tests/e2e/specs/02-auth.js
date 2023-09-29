import mintingPage from "../pages/homepage";
describe("Tests related to Auth", () => {
beforeEach(function () {
  cy.visit("/");
  cy.getMetamaskWalletAddress().then((address) => {
    // If Account 1 is not connected switch to Account 1
    if (Cypress.env("account1") != address) {
      cy.switchMetamaskAccount("account 1").then((switched) => {
        expect(switched).to.be.true;
      });
    }
  });
});

afterEach(function () {
  cy.visit("/");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it("User can connect the wallet", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  cy.getMetamaskWalletAddress().then((address) => {
    cy.formatAddress(address).then((formattedAddress) => {
      cy.log(formattedAddress);
      mintingPage.header.accountBtn().should("contain", formattedAddress);
    });

    mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  });
});

it("User can disconnect the wallet", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.clickOnAccountButton();
  mintingPage.clickOnDisconnectButton();
  mintingPage.header.connectWalletBtn().should("contain", "Connect Wallet");
  cy.get("body").should("contain", "Not connected");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it.skip("User cannot connect the wallet if it's not connected to correct network", function () {

  cy.changeMetamaskNetwork("ethereum").then((networkChanged) => {
    expect(networkChanged).to.be.true;
  });

  mintingPage.clickOnConnectWalletButton();

  mintingPage.header.connectWalletBtn().should("contain", "Connect Wallet");
  cy.get("body").should("contain", "Not connected");
  cy.allowMetamaskToSwitchNetwork();
  cy.getMetamaskWalletAddress().then((address) => {
    cy.formatAddress(address).then((formattedAddress) => {
      cy.log(formattedAddress);
      mintingPage.header.accountBtn().should("contain", formattedAddress);
    });

    mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  });
  
});

it("Application behave as expected when a user change the network while wallet is connected", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  cy.changeMetamaskNetwork("ethereum").then((networkChanged) => {
    expect(networkChanged).to.be.true;
  });
  cy.get("body").should("contain", "Wrong network");
  mintingPage.mintingModal.mintBtn().should("have.attr", "disabled");
  cy.get("button").contains("Switch Network").click();
  cy.allowMetamaskToSwitchNetwork();
  cy.getMetamaskWalletAddress().then((address) => {
    cy.formatAddress(address).then((formattedAddress) => {
      cy.log(formattedAddress);
      mintingPage.header.accountBtn().should("contain", formattedAddress);
    });
  });
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
});
})