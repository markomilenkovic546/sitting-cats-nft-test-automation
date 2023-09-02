import mintingPage from "../pages/homepage";

beforeEach(function () {
  cy.visit("/");
});
it("User can connect the wallet", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  cy.getMetamaskWalletAddress().then((address) => {
    cy.formatAddress(address).then((formattedAddress) => {
      cy.log(formattedAddress);
      mintingPage.header.accountBtn().should("contain", formattedAddress);
    });

    mintingPage.mintingModal.infoMessage().should("contain", "Ready for minting");
    cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
      expect(disconnected).to.be.true;
    });
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
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.changeMetamaskNetwork("Polygon Mumbai").then((networkChanged) => {
    expect(networkChanged).to.be.true;
  });
  
});

it.skip("Application behave as expected when user change the network while wallet is connected", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  cy.changeMetamaskNetwork("ethereum").then((networkChanged) => {
    expect(networkChanged).to.be.true;
  });

  cy.get("button").contains("Switch Network");
  cy.get("body").should("contain", "Wrong network");
  mintingPage.mintingModal.mintBtn().should("have.attr", "disabled");
  

  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });

  cy.changeMetamaskNetwork("Polygon Mumbai").then((networkChanged) => {
    expect(networkChanged).to.be.true;
  });
});


