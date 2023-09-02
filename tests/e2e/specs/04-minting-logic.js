import mintingPage from "../pages/homepage";

beforeEach(function () {
  cy.visit("/");
});
it("Default NFT quantity value is 1 when user access the 'Minting' modal", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it("User cannot set the quantity value lower than 1", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
  mintingPage.mintingModal.decreaseQuantityBtn().should("have.attr", "disabled");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it("User cannot set the quantity greater than number of NFTs allowed to mint", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal
    .nftBalancepPerPhase()
    .invoke("text")
    .then((text) => {
      cy.getAllowedNumberToMint(text).then((allowedNumber) => {
        mintingPage.mintingModal.inputQuantity().clear();
        mintingPage.mintingModal.inputQuantity().type(allowedNumber);
        mintingPage.mintingModal.increaseQuantityBtn().should("have.attr", "disabled");
      });
    });
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it("Quantity limit value is correctly updated after user mint NFT", function () {
  cy.switchMetamaskAccount("account 4").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  mintingPage.mintingModal
    .nftBalancepPerPhase()
    .invoke("text")
    .then((text) => {
      cy.getAllowedNumberToMint(text).then((allowedNumber) => {
        mintingPage.mintingModal.inputQuantity().clear();
        mintingPage.mintingModal.inputQuantity().type(allowedNumber);
        mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
        mintingPage.mintingModal.increaseQuantityBtn().should("have.attr", "disabled");
      });
    });
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("Quantity is updated to 1 after the user mint NFT", function () {
  cy.switchMetamaskAccount("account 3").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});

it("NFT total price is correct according to quantity value", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.mintingModal.nftPrice().should("contain", `Price: ${Cypress.env("nftPrice")} MATIC`);
  for (let i = 2; i <= 7; i++) {
    mintingPage.clickOnPlusButton();
    mintingPage.mintingModal.nftPrice().should("contain", `Price: ${i * Cypress.env("nftPrice")} MATIC`);
  }
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });
});

it.only("The 'Number of claimed NFTs' info updates once the user claims the NFT", function () {
  cy.switchMetamaskAccount("account 5").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  cy.wait(4000);
  mintingPage.mintingModal.nftBalancepPerPhase().should("contain", "1 of 7 NFT claimed");
  cy.disconnectMetamaskWalletFromDapp().then((disconnected) => {
    expect(disconnected).to.be.true;
  });

  cy.switchMetamaskAccount("account 1").then((switched) => {
    expect(switched).to.be.true;
  });
});
