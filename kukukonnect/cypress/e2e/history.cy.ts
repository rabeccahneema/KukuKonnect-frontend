describe('History Page', () => {
  beforeEach(() => {
    cy.on('fail', (err) => {
      console.error('Cypress error:', err.message);
    });

    cy.intercept('POST', '/api/login', {
      statusCode: 201,
      body: {
        token: 'mock-token',
        user: { id: 1, email: 'mary.kamau@gmail.com', user_type: 'Farmer' },
      },
    }).as('login');

    cy.intercept('GET', '/api/history', {
      statusCode: 200,
      body: [
        { id: 1, temperature: '25.5', humidity: '60', timestamp: '2025-10-20T10:00:00Z' },
        { id: 2, temperature: '26.0', humidity: '62', timestamp: '2025-10-20T12:00:00Z' },
        { id: 3, temperature: '24.8', humidity: '58', timestamp: '2025-10-21T10:00:00Z' },
        { id: 4, temperature: '27.2', humidity: '65', timestamp: '2025-10-22T10:00:00Z' },
      ],
    }).as('fetchHistory');

    cy.login('mary.kamau@gmail.com', 'password123');

    cy.visit('/history', {
      timeout: 30_000,
      failOnStatusCode: false,
    });
  });

  it('Loads the history page and displays title', () => {
    cy.get('h1', { timeout: 10_000 })
      .should('be.visible')
      .and('contain.text', 'Temperature and Humidity History');

    cy.contains('button', 'Graph').should('be.visible');
    cy.contains('button', 'List').should('be.visible');
    cy.get('input[placeholder="Select date"]').should('be.visible');
  });

  it('Displays Graph view with temperature and humidity charts', () => {
    cy.wait('@fetchHistory', { timeout: 10_000 });

    cy.contains('button', 'Graph')
      .should('have.class', 'bg-[#D2914A]')
      .or('have.class', 'bg-orange-500');

    cy.contains('button', 'List')
      .should('not.have.class', 'bg-[#D2914A]')
      .and('not.have.class', 'bg-orange-500');

    cy.contains('h2', 'Temperature').should('be.visible');
    cy.contains('Temperature (°C)').should('be.visible');
    cy.contains('Week Days').should('be.visible');
    cy.get('#temperature-chart svg g[role="presentation"] > rect')
      .should('have.length.gte', 1);

    cy.contains('h2', 'Humidity').should('be.visible');
    cy.contains('Humidity (%)').should('be.visible');
    cy.contains('Week Days').should('be.visible');
    cy.get('#humidity-chart svg g[role="presentation"] > rect')
      .should('have.length.gte', 1);
  });

  it('Toggles to List view and displays table', () => {
    cy.wait('@fetchHistory');

    cy.contains('button', 'List').click();

    cy.contains('button', 'List')
      .should('have.class', 'bg-[#D2914A]')
      .or('have.class', 'bg-orange-500');

    cy.get('table').within(() => {
      cy.contains('th', 'Date').should('be.visible');
      cy.contains('th', 'Temperature').should('be.visible');
      cy.contains('th', 'Humidity').should('be.visible');
    });

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain.text', '10/20/2025');
      cy.get('td').eq(1).should('contain.text', '25.75');
      cy.get('td').eq(2).should('contain.text', '61');
    });

    cy.contains('button', 'Next').should('be.visible');
    cy.contains('button', 'Previous').should('be.visible');
    cy.contains('Page 1 of').should('be.visible');

    cy.get('tbody tr').then(($rows) => {
      const perPage = 6;
      if ($rows.length > perPage) {
        cy.contains('button', 'Next').click();
        cy.contains('Page 2 of').should('be.visible');
        cy.contains('button', 'Previous').click();
        cy.contains('Page 1 of').should('be.visible');
      }
    });
  });

  it('Filters data by date using date picker', () => {
    cy.wait('@fetchHistory');

    cy.get('input[placeholder="Select date"]').click({ force: true });

    cy.get('.react-datepicker').within(() => {
      cy.get('.react-datepicker__month-select').select('October');
      cy.get('.react-datepicker__year-select').select('2025');
      cy.contains('.react-datepicker__day', '20')
        .not('.react-datepicker__day--outside-month')
        .click();
    });

    cy.contains('button', 'List').click();
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain.text', '10/20/2025');
      cy.get('td').eq(1).should('contain.text', '25.75');
      cy.get('td').eq(2).should('contain.text', '61');
    });

    cy.contains('button', 'Graph').click();
    cy.get('#temperature-chart svg g[role="presentation"] > rect').should('have.length', 1);
    cy.get('#humidity-chart svg g[role="presentation] > rect').should('have.length', 1);

    cy.get('.react-datepicker__close-icon').click();
    cy.contains('button', 'List').click();
    cy.get('tbody tr').should('have.length.gte', 3);
  });

  it('Handles error state', () => {
    cy.intercept('GET', '/api/history', (req) => {
      req.reply({
        statusCode: 500,
        body: { message: 'Internal Server Error' },
        forceNetworkError: false
      });
    }).as('errorFetchHistory');

    cy.login('mary.kamau@gmail.com', 'password123');
    cy.visit('/history');
    cy.wait('@errorFetchHistory', { timeout: 15_000 });

    cy.get('[class*="text-red"]', { timeout: 10_000 })
      .should('be.visible')
      .and('contain.text', 'Failed to fetch history data')
      .and('contain.text', 'Something went wrong')
      .and('contain.text', 'Internal Server Error');

    cy.get('h1')
      .should('be.visible')
      .and('contain.text', 'Temperature and Humidity History');
  });
});