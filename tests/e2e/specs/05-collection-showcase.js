import mintingPage from "../pages/homepage";
import account9NftCollection from "../fixtures/account-9-nft-collection.json";
const nftCollection = account9NftCollection

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
    mintingPage.clickOnAccountButton()
    mintingPage.showcaseModal.showcaseModal().find('h3').contains('Your NFT Collection')
  });

  it("User can close a 'NFT Show case' modal by clicking on 'Close' button", function () {
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton()
    // Verify that "NFT Showcase" modal is open
    mintingPage.showcaseModal.showcaseModal().contains('Your NFT Collection')
    mintingPage.clickOnCloseShowcaseModalButton()
    // Verify that that "NFT Showcase" modal is closed
    mintingPage.showcaseModal.showcaseModal().should("not.exist");
  });

  it("User can close a 'NFT Show case' modal by clicking beside modal", function () {
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton()
    // Verify that "NFT Showcase" modal is open
    mintingPage.showcaseModal.showcaseModal().contains('Your NFT Collection')
    cy.get('body').click('right', {force: true})
    // Verify that that "NFT Showcase" modal is closed
    mintingPage.showcaseModal.showcaseModal().should("not.exist");
  });

  it.only("When user opens 'NFT Showcase' modal, latest NFT card is selected by default", function () {
    cy.switchMetamaskAccount('account 9').then(switched => {
        expect(switched).to.be.true;
      });
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton()
   // Verify that correct NFT card is selected
    mintingPage.showcaseModal.nftId().should('have.text', nftCollection[6].id)
    mintingPage.showcaseModal.nftCardTitle().should('have.text', nftCollection[6].name)
    mintingPage.showcaseModal.nftImage().should('have.attr', 'alt', `${nftCollection[6].name} NFT cat`)
    mintingPage.showcaseModal.nftCardDescription().should('have.text', nftCollection[6].description)
    cy.wait(50000)
  });

  it.only("When user select the NFT, correct card is displayed", function () {
    cy.switchMetamaskAccount('account 9').then(switched => {
        expect(switched).to.be.true;
      });
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    // Click on the "Account" button
    mintingPage.clickOnAccountButton()
    // Select the NFT from collection
    mintingPage.clickOnNftButton(nftCollection[2].id)
     // Verify that correct NFT card is selected
    mintingPage.showcaseModal.nftId().should('have.text', nftCollection[2].id)
    mintingPage.showcaseModal.nftCardTitle().should('have.text', nftCollection[2].name)
    mintingPage.showcaseModal.nftImage().should('have.attr', 'alt', `${nftCollection[2].name} NFT cat`)
    mintingPage.showcaseModal.nftCardDescription().should('have.text', nftCollection[2].description)
    cy.wait(50000)
  });