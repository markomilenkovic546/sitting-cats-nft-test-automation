class MintingPage {

  /* ================ DOM ELEMENTS=======================*/
  

  header = {
    connectWalletBtn: () => cy.get("button").contains("Connect Wallet"),
    accountBtn: () => cy.get('[data-cy="btn-account"]'),
    numberOfNftsBtnFigure: () => cy.get('[data-cy="btn-account"] figure span')

  };

  showcaseModal = {
    showcaseModal: () => cy.get('[data-cy="container-nft-gallery"]'),
    closeShowcaseModalBtn: () => cy.get('[data-cy="btn-modal-close"]'),
    disconnectBtn: () => cy.get('[data-cy="btn-disconnect"]'),
    nftBtn: (nftId) => cy.get(`[data-cy="btn-nft-item-${nftId}"]`),
    nftCard: () => cy.get('[data-cy="nft-card"]'),
    nftCardTitle: () => cy.get('[data-cy="nft-card"] h4'),
    nftCardDescription: () => cy.get('[data-cy="nft-card"] p'),
    nftId: () => cy.get('[data-cy="href-nft"]'),
    nftImage: () => cy.get('[data-cy="nft-card"] figure img')

   
  }

  balanceCheckModal = {
    modal: () => cy.get('[data-cy="notice-faucet"]'),
    recheckBtn: () => cy.get('[data-cy="btn-recheck-balance"]')
    
  }

  mintingModal = {
    modal: () => cy.get('[data-cy="container-minting"]'),
    infoMessage: (messageText) => cy.get('[data-cy="container-info-message"]')
    .contains(messageText, { timeout: 120000 }),
    decreaseQuantityBtn: () => cy.get('[data-cy="btn-minus"]'),
    increaseQuantityBtn: () => cy.get('[data-cy="btn-plus"]'),
    inputQuantity: () => cy.get('[data-cy="input-quantity"]'),
    mintBtn: () => cy.get('[data-cy="btn-mint"]'),
    nftPrice: () => cy.get('[data-cy="price-total"]'),
    nftBalancepPerPhase: () => cy.get('[data-cy="nft-balance-per-phase"]'),
    claimedNftBtn: ()=> cy.get('[data-cy="btn-claimed-nft"]')
    
  }

  nftCardModal = {
    modal: () => cy.get('[data-cy="container-modal-claimed"]'),
    closeModalBtn: () => cy.get('[data-cy="btn-modal-close"]'),
    nftId: () => cy.get('[data-cy="href-nft"]'),
    nftCardTitle: () => cy.get('[data-cy="container-modal-claimed"] h4'),
    nftCardDescription: () => cy.get('[data-cy="container-modal-claimed"] p'),
    nftImage: () => cy.get('[data-cy="container-modal-claimed"] figure img'),
    nftGalleryBtn: () => cy.get('[data-cy="btn-gallery-open"]')

    
  
    
  }

  /*======================== ACTIONS==============================*/



  // Header actions

  clickOnConnectWalletButton() {
    this.header.connectWalletBtn().click();
  }

  clickOnAccountButton() {
    this.header.accountBtn().click();
  }


  // Showcase modal actions
  clickOnCloseShowcaseModalButton() {
    this.showcaseModal.closeShowcaseModalBtn().click();
  }

  clickOnDisconnectButton() {
    this.showcaseModal.disconnectBtn().click();
  }

  clickOnNftButton(nftId) {
    this.showcaseModal.nftBtn(nftId).click();
  }



  // Balance Check Modal Actions
  clickOnRecheckButton() {
    this.balanceCheckModal.recheckBtn().click();
  }


  
  // Minting Modal Actions
  clickOnMinusButton() {
    this.mintingModal.decreaseQuantityBtn().click();
  }

  clickOnPlusButton() {
    this.mintingModal.increaseQuantityBtn().click();
  }

  clickOnMintButton() {
    this.mintingModal.mintBtn().click();
  }
  clickOnclaimedNftButton() {
    this.mintingModal.claimedNftBtn().click();
  }



  // NFT Card Modal Actions
  clickOnCloseModalButton() {
    this.nftCardModal.closeModalBtn().click();
  }

  clickOnNftGalleryButton() {
    this.nftCardModal.nftGalleryBtn().click();
  }

}

const mintingPage = new MintingPage();
export default mintingPage;
