import mintingPage from "../pages/mintingPage";

beforeEach(function () {
  cy.visit("/");
});
it("User can connect the wallet", function () {
  mintingPage.clickOnConnectWalletBtn();
  cy.acceptMetamaskAccess();
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it("User can disconnect the wallet", function () {
  mintingPage.clickOnConnectWalletBtn();
  cy.acceptMetamaskAccess();
  mintingPage.clickOnDisconnectWalletBtn();
  cy.wait(20000);
})
