describe('TravelSplit Smoke Test', () => {
  it('loads the home screen without errors', () => {
    cy.visit('/');
    cy.contains('TravelSplit'); // Checks for the app title
    cy.contains('Your Trips'); // Checks for a key section
    cy.get('body').should('not.contain', 'Error'); // Basic error check
  });
});
