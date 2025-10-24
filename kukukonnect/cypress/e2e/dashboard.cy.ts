describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.on('fail', (error) => {
      console.log('Cypress error:', error.message);
      throw error;
    });
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-token');
      win.localStorage.setItem('user', JSON.stringify({ id: 1, email: 'mary.kamau@gmail.com', user_type: 'Farmer' }));
    });
    cy.intercept('GET', '/api/thresholds', {
      statusCode: 200,
      body: [
        {
          device_id: 'device-123',
          temp_threshold_min: '32.00',
          temp_threshold_max: '35.00',
          humidity_threshold_min: '40.00',
          humidity_threshold_max: '70.00',
        },
      ],
    }).as('getThresholds');
    cy.intercept('POST', '/api/mock-mqtt', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          timestamp: new Date().toISOString(),
          avg_temp: 33.5,
          avg_humidity: 65.0,
          device_id: 'device-123',
        },
      });
    }).as('mockMqtt');
    console.log('Attempting to load /dashboard');
    cy.visit('/dashboard', {
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
    });
    cy.get('body', { timeout: 10000 }).then(($body) => {
      console.log('Body content:', $body.html());
    });
  });

  it('Loads the dashboard page correctly', () => {
    cy.get('h1').contains('Current Temperature and Humidity').should('be.visible');
    cy.get('div.bg-white.shadow-xl.rounded-xl').should('have.length', 3);
    cy.get('div.bg-white.shadow-xl.rounded-xl').eq(0).within(() => {
      cy.get('div').contains('Temperature').should('be.visible');
      cy.get('div').contains('°C').should('be.visible');
    });
    cy.get('div.bg-white.shadow-xl.rounded-xl').eq(1).within(() => {
      cy.get('div').contains('Humidity').should('be.visible');
      cy.get('div').contains('%').should('be.visible');
    });
    cy.get('div.bg-white.shadow-xl.rounded-xl').eq(2).within(() => {
      cy.get('div').contains('Optimum temp').should('be.visible');
      cy.get('span').contains('32°C - 35°C').should('be.visible');
      cy.get('button').contains('Change Temperature').should('be.visible');
    });
    cy.get('section.bg-white.rounded-2xl').should('have.length', 2);
    cy.get('section.bg-white.rounded-2xl').eq(0).within(() => {
      cy.get('h2').contains('Recent Temperature').should('be.visible');
    });
    cy.get('section.bg-white.rounded-2xl').eq(1).within(() => {
      cy.get('h2').contains('Recent Humidity').should('be.visible');
    });
  });

  it('Cancels TemperatureModal without changes', () => {
    cy.get('div.bg-white.shadow-xl.rounded-xl').eq(2).within(() => {
      cy.get('button').contains('Change Temperature').click();
    });
    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('button').contains('Cancel').click();
    cy.get('div[role="dialog"]').should('not.exist');
  });
});