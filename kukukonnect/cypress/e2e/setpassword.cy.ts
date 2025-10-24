describe("Set Password Page", () => {
 const user = {
   email: "ameer@example.com",
   password: "SecurePass123!",
 };


 beforeEach(() => {
   cy.visit("/set-password");
 });


 it("renders the set password form", () => {
   cy.get("h1").should("contain.text", "Set Password");
   cy.get('input[id="email"]').should("be.visible");
   cy.get('input[id="password"]').should("be.visible");
   cy.get('input[id="confirm"]').should("be.visible");
   cy.get('button[aria-label="Set Password"]').should("exist");
 });


 it("shows error when passwords do not match", () => {
   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="password"]').type("Password123");
   cy.get('input[id="confirm"]').type("Password124");
   cy.get("form").submit();
   cy.get("p.text-red-600").should("contain.text", "Passwords do not match.");
 });


 it("submits successfully with valid data", () => {
   cy.intercept("POST", "/api/set_password", {
     statusCode: 201,
     body: { message: "Password reset successfully" },
   }).as("setPasswordRequest");


   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="password"]').type(user.password);
   cy.get('input[id="confirm"]').type(user.password);
   cy.get("form").submit();


   cy.wait("@setPasswordRequest");
   cy.get("p.text-emerald-700", { timeout: 10000 }).should(
     "contain.text",
     "Password reset successfully"
   );
   cy.url({ timeout: 15000 }).should("include", "/login");
 });


 it("shows backend error if setting password fails", () => {
   cy.intercept("POST", "/api/set_password", {
     statusCode: 400,
     body: { error: "Set password failed. Please try again." },
   }).as("failedSetPassword");


   cy.get('input[id="email"]').type(user.email);
   cy.get('input[id="password"]').type(user.password);
   cy.get('input[id="confirm"]').type(user.password);
   cy.get("form").submit();


   cy.wait("@failedSetPassword");


   cy.get("p.text-red-600", { timeout: 10000 }).should(
     "contain.text",
     "Set password failed. Please try again"
   );
 });
});
