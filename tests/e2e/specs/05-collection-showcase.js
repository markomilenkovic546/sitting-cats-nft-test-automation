import mintingPage from "../pages/homepage";
import account9NftCollection from "../fixtures/account-9-nft-collection.json";
const nftCollection = account9NftCollection;

describe("Tests related to 'Collection-Showcase' feature'", () => {
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

  it("User can open a 'NFT Show case' modal", function () {
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    mintingPage.clickOnAccountButton();
    mintingPage.showcaseModal.showcaseModal().find("h3").contains("Your NFT Collection");
  });

  it("User can close a 'NFT Show case' modal by clicking on 'Close' button", function () {
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton();
    // Verify that "NFT Showcase" modal is open
    mintingPage.showcaseModal.showcaseModal().contains("Your NFT Collection");
    mintingPage.clickOnCloseShowcaseModalButton();
    // Verify that that "NFT Showcase" modal is closed
    mintingPage.showcaseModal.showcaseModal().should("not.exist");
  });

  it("User can close a 'NFT Show case' modal by clicking beside modal", function () {
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton();
    // Verify that "NFT Showcase" modal is open
    mintingPage.showcaseModal.showcaseModal().contains("Your NFT Collection");
    cy.get("body").click("right", { force: true });
    // Verify that that "NFT Showcase" modal is closed
    mintingPage.showcaseModal.showcaseModal().should("not.exist");
  });

  it("When user opens 'NFT Showcase' modal, latest NFT card is selected by default", function () {
    cy.switchMetamaskAccount("account 9").then((switched) => {
      expect(switched).to.be.true;
    });
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton();
    // Verify that correct NFT card is selected
    mintingPage.showcaseModal.nftId().should("have.text", nftCollection[6].id);
    mintingPage.showcaseModal.nftCardTitle().should("have.text", nftCollection[6].name);
    mintingPage.showcaseModal.nftImage().should("have.attr", "alt", `${nftCollection[6].name} NFT cat`);
    mintingPage.showcaseModal.nftCardDescription().should("have.text", nftCollection[6].description);
  });

  it("When a user select the NFT, correct card is displayed", function () {
    cy.switchMetamaskAccount("account 9").then((switched) => {
      expect(switched).to.be.true;
    });
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton();
    for (let i = 0; i < 6; i++) {
      cy.wait(1000);
      // Select the NFT from collection
      mintingPage.clickOnNftButton(nftCollection[i].id);
      // Verify that correct card is displayed
      mintingPage.showcaseModal.nftId().should("have.text", nftCollection[i].id);
      mintingPage.showcaseModal.nftCardTitle().should("have.text", nftCollection[i].name);
      mintingPage.showcaseModal.nftImage().should("have.attr", "alt", `${nftCollection[i].name} NFT cat`);
      mintingPage.showcaseModal.nftCardDescription().should("have.text", nftCollection[i].description);
    }
  });

  it("User can open the 'NFT Showcase' modal from the 'NFT Card' modal ", function () {
    cy.switchMetamaskAccount("account 3").then((switched) => {
      expect(switched).to.be.true;
    });
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
    mintingPage.clickOnMintButton();
    mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
    cy.confirmMetamaskTransaction();
    mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
    mintingPage.clickOnclaimedNftButton();
    mintingPage.clickOnNftGalleryButton();
    mintingPage.showcaseModal.showcaseModal().find("h3").contains("Your NFT Collection");
  });
});
