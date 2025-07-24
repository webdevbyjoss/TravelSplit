describe('TravelSplit Smoke Test', () => {
  it('loads the home screen without errors', () => {
    cy.visit('/');
    cy.contains('TravelSplit'); // Checks for the app title
    cy.get('body').should('not.contain', 'Error'); // Basic check for error boundaries
  });
});
