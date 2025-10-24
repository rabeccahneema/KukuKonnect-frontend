describe('Reset Password Page', () => {
 it('should show the reset password form', () => {
   cy.visit('/reset-password');
   cy.contains('Reset Password').should('be.visible');
   cy.get('input#email').should('be.visible');
   cy.get('input#password').should('be.visible');
   cy.get('input#confirm').should('be.visible');
   cy.get('button[type=submit][aria-label="Reset Password"]').should('exist');
 });


 it('should validate mismatched passwords', () => {
   cy.visit('/reset-password');
   cy.get('input#email').type('user@example.com');
   cy.get('input#password').type('Password123!');
   cy.get('input#confirm').type('Password124!');
   cy.get('button[type=submit]').click();
   cy.contains('Passwords do not match.').should('be.visible');
 });


 it('should submit and show confirmation on valid data', () => {
   cy.visit('/reset-password');
   cy.intercept('POST', '/api/reset_password', {
     statusCode: 201,
     body: { message: 'Password reset successfully' },
   }).as('resetRequest');
   cy.get('input#email').type('user@example.com');
   cy.get('input#password').type('ValidPass123!');
   cy.get('input#confirm').type('ValidPass123!');
   cy.get('button[type=submit]').click();
   cy.wait('@resetRequest');
   cy.contains('Password reset successfully').should('be.visible');
 });


 it('should show API errors', () => {
   cy.visit('/reset-password');
   cy.intercept('POST', '/api/reset_password', {
     statusCode: 400,
     body: { error: 'Email not found' },
   }).as('resetRequestError');
   cy.get('input#email').type('notfound@example.com');
   cy.get('input#password').type('Whatever123!');
   cy.get('input#confirm').type('Whatever123!');
   cy.get('button[type=submit]').click();
   cy.wait('@resetRequestError');
   cy.get('p.text-red-600', { timeout: 10000 }).should('contain.text', 'Reset password failed. Please try again');
 });
});


