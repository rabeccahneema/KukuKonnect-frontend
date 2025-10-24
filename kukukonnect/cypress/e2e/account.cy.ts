describe('Account Page', () => {
  beforeEach(() => {
    cy.on('fail', (error) => {
      console.log('Cypress error:', error.message);
      throw error;
    });
    cy.intercept('POST', '/api/login', {
      statusCode: 201,
      body: {
        token: 'mock-token',
        user: {
          id: 1,
          email: 'mary.kamau@gmail.com',
          user_type: 'Farmer',
        },
      },
    }).as('login');
    cy.login('mary.kamau@gmail.com', 'password123');
    cy.intercept('GET', '/api/users/1', {
      statusCode: 200,
      body: {
        id: 1,
        first_name: 'mary',
        last_name: 'kamau',
        email: 'mary.kamau@gmail.com',
        phone_number: '1234567890',
        username: 'marykamau',
        user_type: 'Farmer',
        device_id: 'device123',
        image: '/images/profile.jpg',
      },
    }).as('fetchUser');

    cy.intercept('PUT', '/api/users/1', {
      statusCode: 200,
      body: { message: 'User updated successfully' },
    }).as('updateUser');

    cy.intercept('DELETE', '/api/users/1', {
      statusCode: 200,
      body: { message: 'User deleted successfully' },
    }).as('deleteUser');

    cy.intercept('POST', '/api/set_password', (req) => {
      const { email, password } = req.body;
      if (email === 'mary.kamau@gmail.com' && password === 'newpassword123') {
        req.reply({
          statusCode: 201,
          body: { message: 'Password changed successfully' },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: { non_field_errors: 'Only farmers can set their password using this endpoint.' },
        });
      }
    }).as('setPassword');
    cy.visit('/account', {
      timeout: 60000,
      retryOnNetworkFailure: true,
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        console.log('Page is about to load');
      },
      onLoad: (win) => {
        console.log('Page loaded successfully');
      },
    }).then((response) => {
      console.log('Visit response:', response);
      cy.url().then((url) => {
        console.log('Current URL:', url);
      });
    });
    cy.get('body', { timeout: 10000 }).then(($body) => {
      console.log('Body content:', $body.html());
    });
  });
  it('Loads the account page and displays tabs', () => {
    cy.get('h1').contains('Account Settings').should('be.visible');
    cy.get('button').contains('Edit Profile').should('be.visible');
    cy.get('button').contains('Change Password').should('be.visible');
    cy.get('button').contains('Delete Account').should('be.visible');
    cy.get('button').contains('Edit Profile').should('have.class', 'bg-white');
  });

  it('Edits profile details and submits successfully', () => {
    cy.get('form').within(() => {
      cy.get('h2').contains('Profile Photo').should('be.visible');
      cy.get('input#firstName').should('have.value', 'mary');
      cy.get('input#email').should('have.value', 'mary.kamau@gmail.com');
    });

    cy.get('button:contains("Edit Profile")').then(($buttons) => {
      console.log('Edit Profile buttons found:', $buttons.length);
      $buttons.each((i, el) => {
        console.log(`Edit Profile button ${i} attributes:`, Cypress.$(el).prop('outerHTML'));
      });
    });
    cy.get('form').within(() => {
      cy.get('button').contains('Edit Profile').click({ force: true });
    });
    cy.wait(3000); 
    cy.get('form').then(($form) => {
      console.log('Form attributes after Edit Profile click:', $form.prop('outerHTML'));
    });
    cy.get('input#firstName', { timeout: 15000 }).then(($input) => {
      console.log('FirstName input attributes:', $input.prop('outerHTML'));
      console.log('FirstName input disabled:', $input.prop('disabled'));
    });
    cy.get('input#firstName', { timeout: 15000 }).should('not.have.attr', 'disabled');

    cy.get('input#firstName').clear().type('Jane');
    cy.get('input#lastName').clear().type('njeri');
    cy.get('input#email').clear().type('jane.njeri@gmail.com');
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake image content'),
      fileName: 'profile.jpg',
      mimeType: 'image/jpeg',
    }, { force: true });
    cy.get('form').within(() => {
      cy.get('button').contains('Save Changes').click();
    });
    cy.wait('@updateUser', { timeout: 10000 }).then((interception) => {
      console.log('updateUser response:', interception.response.body);
    });
    cy.get('body', { timeout: 10000 })
      .contains('Profile updated successfully', { matchCase: false })
      .should('be.visible');
  });

  it('Changes password successfully', () => {
    cy.get('button').contains('Change Password').click();
    cy.get('form').within(() => {
      cy.get('h2').contains('Change Password').should('be.visible');
      cy.get('input#email').should('have.value', 'mary.kamau@gmail.com');
      cy.get('input#newPassword').type('newpassword123');
      cy.get('input#confirmPassword').type('newpassword123');
      cy.get('button[aria-label="Show password"]').first().click();
      cy.get('input#newPassword').should('have.attr', 'type', 'text');
      cy.get('button').contains('Change Password').click();
    });
    cy.wait('@setPassword', { timeout: 15000 }).then((interception) => {
      console.log('setPassword response:', interception.response.body);
    });
    cy.get('body', { timeout: 10000 })
      .contains('Password changed successfully', { matchCase: false })
      .should('be.visible');
  });

  it('Handles password mismatch error', () => {
    cy.get('button').contains('Change Password').click();
    cy.get('input#newPassword').type('newpassword123');
    cy.get('input#confirmPassword').type('wrongpassword');
    cy.get('p').contains('Passwords do not match').should('be.visible');
    cy.get('button').contains('Change Password').click();
    cy.get('@setPassword').should('not.exist');
  });

  it('Opens and cancels delete account modal', () => {
    cy.get('button').contains('Delete Account').click();
    cy.get('[class*="bg-white"]').contains('Are you sure you want to delete your account?').should('be.visible');
    cy.get('button').contains('Cancel').click();
    cy.get('[class*="bg-white"]').contains('Are you sure you want to delete your account?').should('not.exist');
  });
});
