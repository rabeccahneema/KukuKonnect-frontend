describe("Welcome Screen", () => {
 beforeEach(() => {
   cy.visit("/");  
 });
 it("renders the welcome page content", () => {
   cy.get("h1").should("contain.text", "Welcome to");
   cy.get('h1 span[class*="text-[#d89243]"]').should("contain.text", "Kuku");
   cy.get('h1 span[class*="text-[#1c4f46]"]').should("contain.text", "Konnect");


   cy.contains("button", "Farmer").should("be.visible");
   cy.contains("button", "AgroVet").should("be.visible");
 });

 it("clicking Farmer navigates to /set-password", () => {
   cy.contains("button", "Farmer").click();
   cy.url({ timeout: 10000 }).should("include", "/set-password");
 });


 it("clicking AgroVet navigates to /login", () => {
   cy.contains("button", "AgroVet").click();
   cy.url({ timeout: 10000 }).should("include", "/login");
 });
});


