import mintingPage from "../pages/homepage";

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

it("Default NFT quantity value is 1 when user access the 'Minting' modal", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
});

it("User cannot set the quantity value lower than 1", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
  mintingPage.mintingModal.decreaseQuantityBtn().should("have.attr", "disabled");
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
});

it("Quantity limit value is correctly updated once the user mint the NFT", function () {
  cy.switchMetamaskAccount("account 4").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
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
});

it("Quantity is updated to 1 once the user mint the NFT", function () {
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
  mintingPage.mintingModal.inputQuantity().should("have.attr", "value", "1");
});

it("NFT total price is correct according to quantity value", function () {
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.mintingModal.nftPrice().should("contain", `Total price: ${Cypress.env("nftPrice")} MATIC`);
  for (let i = 2; i <= Cypress.env("nftClaimLimit"); i++) {
    mintingPage.clickOnPlusButton();
    mintingPage.mintingModal.nftPrice().should("contain", `Total price: ${i * Cypress.env("nftPrice")} MATIC`);
  }
});

it("The 'Number of claimed NFTs' info updates once the user claims the NFT", function () {
  cy.switchMetamaskAccount("account 5").then((switched) => {
    expect(switched).to.be.true;
  });

  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  mintingPage.mintingModal.nftBalancepPerPhase().should("contain", `1 of ${Cypress.env("nftClaimLimit")} NFT claimed`);
});

it("User can mint the minimum allowed number of NFTs", function () {
  // Switch account
  cy.switchMetamaskAccount("account 6").then((switched) => {
    expect(switched).to.be.true;
  });
  // Connect Wallet
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  // Confirm transaction
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("Waiting for the receipt").should("be.visible");
  mintingPage.mintingModal.infoMessage("Succesfully claimed. Preparing, please wait").should("be.visible");
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  cy.wait(2000);
  // Get id of the minted NFT displayed in Minting Modal
  mintingPage.mintingModal
    .claimedNftBtn()
    .invoke("attr", "data-nft-id")
    .then((nftID) => {
      // Get name of the minted NFT displayed in Minting Modal
      mintingPage.mintingModal
        .claimedNftBtn()
        .find('[data-cy="img-nft-cat"]')
        .invoke("attr", "alt")
        .then((alt) => {
          const splitedAltString = alt.split(" ");
          const nftName = splitedAltString[0];
          cy.log(nftName);
          // Open the NFT Card modal
          mintingPage.clickOnclaimedNftButton();
          // Verify that correct info is displayed in the NFT Card modal
          mintingPage.nftCardModal.nftId().should("have.text", nftID);
          mintingPage.nftCardModal.nftCardTitle().should("have.text", nftName);
          mintingPage.nftCardModal
            .nftImage()
            .invoke("attr", "alt")
            .then((modalImgAlt) => {
              // Verify that correct NFT image is displayed in the mindet NFT modal
              expect(alt).to.equal(modalImgAlt);
              // Call the function on smart contract to get owner of the NFT displayed as minted
              cy.getNftOwner(nftID).then((nftOwner) => {
                cy.getMetamaskWalletAddress().then((address) => {
                  // Verify that the NFT owner's address on the smart contract matches the address that was minted during this test
                  expect(nftOwner).to.equal(address);
                  cy.log(`nftOwnerAddress:${nftOwner}`);
                  cy.log(`address:${address}`);
                });
              });
            });
        });
    });
});

it("User can mint one by one the maximum allowed number of NFTs to mint", function () {
  // Switch account
  cy.switchMetamaskAccount("account 8").then((switched) => {
    expect(switched).to.be.true;
  });
  // Connect Wallet
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  for (let i = 0; i < Cypress.env("nftClaimLimit"); i++) {
    mintingPage.clickOnMintButton();
    mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
    // Confirm transaction
    cy.confirmMetamaskTransaction();
    mintingPage.mintingModal.infoMessage("Waiting for the receipt").should("be.visible");
    mintingPage.mintingModal.infoMessage("Succesfully claimed. Preparing, please wait").should("be.visible");
    if (i < Cypress.env("nftClaimLimit") - 1) {
      mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
    } else {
      mintingPage.mintingModal.infoMessage("NFTs successfully claimed. Maximum NFTs per wallet minted.");
    }
    cy.wait(2000);
    // Get id of the minted NFT displayed in Minting Modal
    mintingPage.mintingModal
      .claimedNftBtn()
      .invoke("attr", "data-nft-id")
      .then((nftID) => {
        // Get name of the minted NFT displayed in Minting Modal
        mintingPage.mintingModal
          .claimedNftBtn()
          .find('[data-cy="img-nft-cat"]')
          .invoke("attr", "alt")
          .then((alt) => {
            const splitedAltString = alt.split(" ");
            const nftName = splitedAltString[0];
            cy.log(nftName);
            // Open the NFT Card modal
            mintingPage.clickOnclaimedNftButton();
            // Verify that correct info is displayed in the NFT Card modal
            mintingPage.nftCardModal.nftId().should("have.text", nftID);
            mintingPage.nftCardModal.nftCardTitle().should("have.text", nftName);
            mintingPage.nftCardModal
              .nftImage()
              .invoke("attr", "alt")
              .then((modalImgAlt) => {
                // Verify that correct NFT image is displayed in the mindet NFT modal
                expect(alt).to.equal(modalImgAlt);
                // Call the function on smart contract to get owner of the NFT displayed as minted
                cy.getNftOwner(nftID).then((nftOwner) => {
                  cy.getMetamaskWalletAddress().then((address) => {
                    // Verify that the NFT owner's address on the smart contract matches the address that was minted during this test
                    expect(nftOwner).to.equal(address);
                    cy.log(`nftOwnerAddress:${nftOwner}`);
                    cy.log(`address:${address}`);
                    mintingPage.clickOnCloseModalButton();
                  });
                });
              });
          });
      });
  }
});

it("User can mint the maximum allowed number of NFTs", function () {
  cy.switchMetamaskAccount("account 7").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.mintingModal.inputQuantity().clear();
  mintingPage.mintingModal.inputQuantity().type(Cypress.env("nftClaimLimit"));
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("Waiting for the receipt").should("be.visible");
  mintingPage.mintingModal.infoMessage("Succesfully claimed. Preparing, please wait").should("be.visible");
  mintingPage.mintingModal
    .infoMessage("NFTs successfully claimed. Maximum NFTs per wallet minted.")
    .should("be.visible");
  mintingPage.mintingModal
    .nftBalancepPerPhase()
    .contains(`${Cypress.env("nftClaimLimit")} of ${Cypress.env("nftClaimLimit")} NFTs claimed`);
  cy.wait(2000);
  mintingPage.mintingModal
    .claimedNftBtn()
    .invoke("attr", "data-nft-id")
    .then((nftID) => {
      mintingPage.mintingModal
        .claimedNftBtn()
        .find('[data-cy="img-nft-cat"]')
        .invoke("attr", "alt")
        .then((alt) => {
          const splitedAltString = alt.split(" ");
          const nftName = splitedAltString[0];
          cy.log(nftName);
          mintingPage.clickOnclaimedNftButton();
          cy.get(".font-bold").contains(`1 of ${Cypress.env("nftClaimLimit")} freshly minted NFTs shown.`);
          mintingPage.nftCardModal.nftId().should("have.text", nftID);
          mintingPage.nftCardModal.nftCardTitle().should("have.text", nftName);
          mintingPage.nftCardModal
            .nftImage()
            .invoke("attr", "alt")
            .then((modalImgAlt) => {
              expect(alt).to.equal(modalImgAlt);
              for (let i = 0; i < Cypress.env("nftClaimLimit"); i++) {
                let id = Number(nftID) + i;
                cy.getNftOwner(id).then((nftOwner) => {
                  cy.getMetamaskWalletAddress().then((address) => {
                    // Verify that the NFT owner's address on the smart contract matches the address that was minted during this test
                    expect(nftOwner).to.equal(address);
                    cy.log(`nftOwnerAddress:${nftOwner}`);
                    cy.log(`address:${address}`);
                  });
                });
                cy.wait(3000);
              }
            });
        });
    });
});

it.skip("User cannot mint more than maximum allowed number of NFTs to mint", function () {
  cy.switchMetamaskAccount("account 7").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.mintingModal.inputQuantity().clear();
  mintingPage.mintingModal.inputQuantity().type(Cypress.env("nftClaimLimit"));
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("Waiting for the receipt").should("be.visible");
  mintingPage.mintingModal.infoMessage("Succesfully claimed. Preparing, please wait").should("be.visible");
  mintingPage.mintingModal
    .infoMessage("NFTs successfully claimed. Maximum NFTs per wallet minted.")
    .should("be.visible");
  mintingPage.mintingModal
    .nftBalancepPerPhase()
    .contains(`${Cypress.env("nftClaimLimit")} of ${Cypress.env("nftClaimLimit")} NFTs claimed`);
  cy.wait(2000);
  mintingPage.mintingModal
    .claimedNftBtn()
    .invoke("attr", "data-nft-id")
    .then((nftID) => {
      mintingPage.mintingModal
        .claimedNftBtn()
        .find('[data-cy="img-nft-cat"]')
        .invoke("attr", "alt")
        .then((alt) => {
          const splitedAltString = alt.split(" ");
          const nftName = splitedAltString[0];
          cy.log(nftName);
          mintingPage.clickOnclaimedNftButton();
          cy.get(".font-bold").contains(`1 of ${Cypress.env("nftClaimLimit")} freshly minted NFTs shown.`);
          mintingPage.nftCardModal.nftId().should("have.text", nftID);
          mintingPage.nftCardModal.nftCardTitle().should("have.text", nftName);
          mintingPage.nftCardModal
            .nftImage()
            .invoke("attr", "alt")
            .then((modalImgAlt) => {
              expect(alt).to.equal(modalImgAlt);
            });
          mintingPage.mintingModal.mintBtn().should("have.attr", "disabled");
        });
    });
});

it("The 'Number of claimed NFTs by user' info updates once the user claims the NFT", function () {
  cy.switchMetamaskAccount("account 5").then((switched) => {
    expect(switched).to.be.true;
  });
  mintingPage.clickOnConnectWalletButton();
  cy.acceptMetamaskAccess();
  mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
  mintingPage.clickOnMintButton();
  mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
  cy.confirmMetamaskTransaction();
  mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
  cy.wait(4000);
  mintingPage.mintingModal.nftBalancepPerPhase().should("contain", `1 of ${Cypress.env("nftClaimLimit")} NFT claimed`);
});

it("Total claimed NFTs info update correctly once the user mint the NFT", function () {
  cy.switchMetamaskAccount("account 3").then((switched) => {
    expect(switched).to.be.true;
  });
  cy.getTotalClaimedValue().then((totalClaimedValue) => {
    const totalClaimed = Number(totalClaimedValue);
    cy.log(totalClaimed);
    mintingPage.clickOnConnectWalletButton();
    cy.acceptMetamaskAccess();
    mintingPage.mintingModal.infoMessage("Ready for minting").should("be.visible");
    mintingPage.clickOnMintButton();
    mintingPage.mintingModal.infoMessage("Please confirm transaction in your wallet to continue.").should("be.visible");
    cy.confirmMetamaskTransaction();
    mintingPage.mintingModal.infoMessage("NFT successfully claimed. You can continue minting.").should("be.visible");
    cy.get("p").contains(`Claiming an NFT is like putting a digital trophy on your virtual shelf. Total claimed NFTs: ${totalClaimed + 1}`);
  });
  
});


