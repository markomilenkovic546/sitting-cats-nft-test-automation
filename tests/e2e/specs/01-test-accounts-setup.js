it("Import MetaMask accounts", function () {

  for (let i = 0; i < 3; i++) {
    cy.createMetamaskAccount().then(created => {
        expect(created).to.be.true;
      });
  }
  cy.switchMetamaskAccount('account 1').then(switched => {
    expect(switched).to.be.true;
  });
  });