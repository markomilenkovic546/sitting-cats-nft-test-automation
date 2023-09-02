import mintingPage from "../pages/homepage";

beforeEach(function () {
  cy.visit("/");
});

it("The 'Balance Check' modal shows up when the user has insufficient funds on the account", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("When user recheck the balance with insufficient funds, the 'Balance Check' modal is still displayed", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.clickOnRecheckButton();
  mintingPage.balanceCheckModal.recheckBtn().should("have.attr", "disabled");
  mintingPage.balanceCheckModal.recheckBtn().should("not.have.attr", "disabled", { timeout: 20000 });
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("The 'Minting Modal' is disabled when the user has insufficient funds on the account", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  mintingPage.mintingModal.mintBtn().should("have.attr", "disabled");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("The 'Minting Modal' is still disabled after the user's recheck of the balance with insufficient funds", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.clickOnRecheckButton();
  mintingPage.balanceCheckModal.recheckBtn().should("have.attr", "disabled");
  mintingPage.balanceCheckModal.recheckBtn().should("not.have.attr", "disabled", { timeout: 20000 });
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  mintingPage.mintingModal.mintBtn().should("have.attr", "disabled");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("User can navigate to the faucet 1 website", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  mintingPage.balanceCheckModal.modal().find("a").eq(0).invoke("removeAttr", "target");
  mintingPage.balanceCheckModal.modal().find("a").eq(0).click();
  cy.origin("https://faucet.polygon.technology", () => {
    cy.get("body").contains("faucet.polygon.technology");
    cy.url().should("eq", "https://faucet.polygon.technology/");
  });

  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("User can navigate to the faucet 2 website", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  mintingPage.balanceCheckModal.modal().find("a").eq(1).invoke("removeAttr", "target");
  mintingPage.balanceCheckModal.modal().find("a").eq(1).click();
  cy.origin("https://mumbaifaucet.com/", () => {
    cy.url().should("eq", "https://mumbaifaucet.com/");
  });
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("User can navigate to the faucet 3 website", function () {
  cy.switchMetamaskAccount("account 2").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.balanceCheckModal.modal().should("contain", "You're low on MATIC!");
  mintingPage.balanceCheckModal.modal().find("a").eq(2).invoke("removeAttr", "target");
  mintingPage.balanceCheckModal.modal().find("a").eq(2).click();
  cy.origin("https://testmatic.vercel.app/", () => {
    cy.url().should("eq", "https://testmatic.vercel.app/");
  });

  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});
