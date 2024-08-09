describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/contacts')
  })

  it('should add a new contact and then edit it', () => {
    cy.contains('button', 'Add Contact').click();


    cy.get('[data-cy="name"]').type('John Doe');
    cy.get('[data-cy="email"]').type('john.doe@example.com');
    cy.get('[data-cy="phone"]').type('1234567890');
    cy.get('kendo-dropdownlist').click();
    cy.get('kendo-popup').find('li').contains('Female').click();
    cy.get('kendo-radiobutton[value="On"]').click();
   
    cy.get('button[type="submit"]').should('be.visible').click();

    // Check for the notification message
    cy.contains('Contact added').should('be.visible');

    cy.get('.dialog-selector').should('not.exist');




    cy.contains('button', 'Edit').click();

    cy.get('kendo-dropdownlist').click();
    cy.get('kendo-popup').find('li').contains('Male').click();

    cy.get('button[type="submit"]').should('be.visible').click();

    // Check for the notification message
    cy.contains('Contact updated').should('be.visible');

    cy.get('.dialog-selector').should('not.exist');
  });

})