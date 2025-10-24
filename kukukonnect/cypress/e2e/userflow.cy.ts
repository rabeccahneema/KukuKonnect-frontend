/// <reference types="cypress" />
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.contains("button", "Log In").click();
});
const user = {
  firstName: "Mary",
  lastName: "Kamau",
  username: "mary.kamau",
  email: "mary.kamau@gmail.com",
  phone: "+254712345678",
  password: "password123",
};
describe("Full User Flow", () => {
  before(() => {
    cy.viewport(1280, 800); 
  });

  it("Visits Welcome Screen", () => {
    cy.visit("/");
    cy.get("h1").should("contain.text", "Welcome to");
    cy.get('h1 span[class*="text-[#d89243]"]').should("contain.text", "Kuku");
    cy.get('h1 span[class*="text-[#1c4f46]"]').should("contain.text", "Konnect");
    cy.contains("button", "Farmer", { timeout: 20000 }).should("be.visible");
    cy.contains("button", "AgroVet").should("be.visible");
  });

  it("Navigate from Welcome to Signup and back", () => {
    cy.visit("/");
    cy.viewport(1280, 800);
    cy.contains("button", "Farmer", { timeout: 20000 }).should("be.visible").click();
    cy.url({ timeout: 15000 }).should("include", "/set-password");


    cy.contains("Already have an account?", { timeout: 10000 })
      .should("be.visible")
      .parent()
      .contains("a", "Log in") 
      .click();

    cy.url({ timeout: 15000 }).should("include", "/login");
    cy.visit("/");
    cy.contains("button", "AgroVet", { timeout: 20000 }).should("be.visible").click();
    cy.url({ timeout: 15000 }).should("include", "/login");
  });

  it("Sign up user Mary Kamau", () => {
    cy.visit("/signup");
    cy.get('input[id="firstName"]').type(user.firstName);
    cy.get('input[id="lastName"]').type(user.lastName);
    cy.get('input[id="username"]').type(user.username);
    cy.get('input[id="email"]').type(user.email);
    cy.get('input[id="phone"]').type(user.phone);
    cy.get('input[id="password"]').type(user.password);
    cy.get('input[id="confirm"]').type(user.password);

    cy.intercept("POST", "/api/signup", {
      statusCode: 201,
      body: { message: "Account created successfully." },
    }).as("signup");
    cy.get("form").submit();
    cy.wait("@signup");
    cy.url().should("include", "/login");
  });

  it("Login Mary Kamau", () => {
    cy.visit("/login");
    cy.get('input[id="email"]').type(user.email);
    cy.get('input[id="password"]').type(user.password);

    cy.window().then((win) => {
      win.localStorage.setItem("token", "mock-token");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, email: user.email, user_type: "Farmer" })
      );
    });

    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { user: { user_type: "Farmer", email: user.email } },
    }).as("login");

    cy.intercept("GET", "/api/thresholds", {
      statusCode: 200,
      body: [],
    }).as("getThresholds");

    cy.contains("button", "Log In").click();
    cy.wait("@login");
    cy.wait("@getThresholds");
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("Visit Dashboard & Check Data", () => {
    cy.visit("/dashboard");
    cy.get("h1").should("contain.text", "Current Temperature and Humidity");
  });

  it("Visit History page and test features including datepicker", () => {
    cy.intercept({
      method: "GET",
      url: /\/api\/history(\?.*)?$/,
    }, {
      statusCode: 200,
      body: [
        { id: 1, temperature: "25.5", humidity: "60", timestamp: "2025-10-20T10:00:00Z" },
        { id: 2, temperature: "26.0", humidity: "62", timestamp: "2025-10-20T12:00:00Z" },
        { id: 3, temperature: "24.8", humidity: "58", timestamp: "2025-10-21T10:00:00Z" },
        { id: 4, temperature: "27.2", humidity: "65", timestamp: "2025-10-22T10:00:00Z" },
      ],
    }).as("fetchHistory");

    cy.visit("/history");
    cy.wait("@fetchHistory", { timeout: 15000 });

    cy.get("h1", { timeout: 10000 }).should("contain.text", "Temperature and Humidity History");
    cy.contains("button", "Graph").should("be.visible");
    cy.contains("button", "List").should("be.visible");
    cy.get('input[placeholder="Select date"]').should("be.visible");


    cy.get('input[placeholder="Select date"]').click({ force: true });
    cy.get(".react-datepicker", { timeout: 10000 }).should("be.visible");


    cy.contains('.react-datepicker__day', '20')
      .not('.react-datepicker__day--outside-month')
      .not('.react-datepicker__day--disabled')
      .click({ force: true });


    cy.contains("button", "List").click();
    cy.get("tbody tr").first().within(() => {
      cy.get("td").eq(0).should("contain.text", "10/20/2025");
    });
  });

  it("Test error handling on history page", () => {
    cy.intercept("GET", "/api/history", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("errorHistory");

    cy.visit("/history");
    cy.wait("@errorHistory");
    cy.get('[class*="text-red"]').should("contain.text", "Failed to fetch history data");
  });

  it("Test Logout flow with confirmation", () => {
    cy.viewport(1280, 800);
    cy.visit("/dashboard");
    cy.get("button").contains("Logout").click({ force: true });
    cy.get("div").contains("Confirm Log Out").should("be.visible");
    cy.contains("button", "No").click();
    cy.get("div").contains("Confirm Log Out").should("not.exist");

    cy.get("button").contains("Logout").click({ force: true });
    cy.contains("button", "Yes").click();
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});