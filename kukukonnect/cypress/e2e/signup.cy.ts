describe("Sign Up Page", () => {
 const user = {
   firstName: "Ameer",
   lastName: "Akech",
   username: "ameer_akech",
   email: "ameer@example.com",
   phone: "+254712345678",
   password: "SecurePass123!",
 };


 beforeEach(() => {
   cy.visit("/signup");
 });


 it("displays the signup form", () => {
   cy.get("h1").should("contain", "Sign Up");
   cy.get('input[id="firstName"]').should("be.visible");
   cy.get('input[id="lastName"]').should("be.visible");
   cy.get('input[id="username"]').should("be.visible");
   cy.get('input[id="email"]').should("be.visible");
   cy.get('input[id="phone"]').should("be.visible");
   cy.get('input[id="password"]').should("be.visible");
   cy.get('input[id="confirm"]').should("be.visible");
   cy.get("button[type='submit']").should("contain", "Sign Up");
 });


 it("shows error when passwords do not match", () => {
   cy.get('input[id="firstName"]').type(user.firstName);
   cy.get('input[id="lastName"]').type(user.lastName);
   cy.get('input[id="username"]').type(user.username);
   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="phone"]').type(user.phone);
   cy.get('input[id="password"]').type("Password123");
   cy.get('input[id="confirm"]').type("Different123");


   cy.get("form").submit();
   cy.get("p.text-red-600").should("contain", "Passwords do not match.");
 });


 it("submits successfully with valid data", () => {
   cy.intercept("POST", "/api/signup", {
     statusCode: 201,
     body: { message: "Account created successfully." },
   }).as("registerRequest");


   cy.get('input[id="firstName"]').type(user.firstName);
   cy.get('input[id="lastName"]').type(user.lastName);
   cy.get('input[id="username"]').type(user.username);
   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="phone"]').type(user.phone);
   cy.get('input[id="password"]').type(user.password);
   cy.get('input[id="confirm"]').type(user.password);


   cy.get("form").submit();
   cy.wait("@registerRequest");


   cy.get("p.text-emerald-700", { timeout: 10000 }).should(
     "contain.text",
     "Account created successfully."
   );
   cy.url().should("include", "/login");
 });


 it("shows backend error if registration fails", () => {
   cy.intercept("POST", "/api/signup", {
     statusCode: 400,
     body: { message: "Username already taken" },
   }).as("failedRegister");


   cy.get('input[id="firstName"]').type(user.firstName);
   cy.get('input[id="lastName"]').type(user.lastName);
   cy.get('input[id="username"]').type(user.username);
   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="phone"]').type(user.phone);
   cy.get('input[id="password"]').type(user.password);
   cy.get('input[id="confirm"]').type(user.password);


   cy.get("form").submit();
   cy.wait("@failedRegister");


   cy.get("p.text-red-600", { timeout: 10000 }).should(
     "contain.text",
     "Registration failed. Please try again"
   );
 });


 it("prevents submission when required fields are missing", () => {
   cy.intercept("POST", "/api/signup").as("register");


   cy.get('input[id="firstName"]').type(user.firstName);
   cy.get('input[id="lastName"]').type(user.lastName);
   cy.get('input[id="username"]').type(user.username);
   cy.get('input[id="phone"]').type(user.phone);
   cy.get('input[id="password"]').type(user.password);
   cy.get('input[id="confirm"]').type(user.password);


   cy.get("form").submit();


   cy.wait(500); 
   cy.get("@register.all").should("have.length", 1); 
 });
});
