describe("OTP Verification Page", () => {
 const emailKey = "forgotPasswordEmail";
 const storedEmail = "user@example.com";


 beforeEach(() => {
   cy.visit("/verify-otp", {
     onBeforeLoad(win) {
       win.localStorage.setItem(emailKey, storedEmail);
     },
     timeout: 120000,
   });
 });


 it("renders OTP input fields and form", () => {
   cy.get("h1").should("contain.text", "OTP Verification");
   cy.get("input[type='text']").should("have.length", 4);
   cy.get("button[type='submit']").should("contain.text", "Verify OTP");
 });


 it("shows error if OTP length less than 4 digits", () => {
   cy.get("input").eq(0).type("1");
   cy.get("input").eq(1).type("2");
   cy.get("input").eq(2).type("3");
   cy.get("button[type='submit']").click();


   cy.get("p.text-red-600").should("contain.text", "Please enter the 4-digit code");
 });


 it("shows error if localStorage email is missing", () => {
   cy.visit("/verify-otp", {
     onBeforeLoad(win) {
       win.localStorage.removeItem(emailKey);
     },
     timeout: 120000,
   });


   cy.get("input").each(($input) => {
     cy.wrap($input).type("1");
   });


   cy.get("button[type='submit']").click();


   cy.get("p.text-red-600").should("contain.text", "No email found. Please restart the process.");
 });


 it("verifies OTP successfully", () => {
   cy.intercept("POST", "/api/verify_otp", {
     statusCode: 201,
     body: { message: "OTP verified successfully" },
   }).as("verifyOtpRequest");


   cy.get("input").eq(0).type("1");
   cy.get("input").eq(1).type("2");
   cy.get("input").eq(2).type("3");
   cy.get("input").eq(3).type("4");


   cy.get("button[type='submit']").click();


   cy.wait("@verifyOtpRequest");


   cy.get("p.text-emerald-700", { timeout: 15000 }).should("contain.text", "OTP verified successfully");


   cy.wait(1000);
   cy.url({ timeout: 30000 }).should("include", "/reset-password");
 });


 it("shows error message for invalid OTP", () => {
   cy.intercept("POST", "/api/verify_otp", {
     statusCode: 400,
     body: { message: "OTP verification failed" },
   }).as("failedOtpRequest");


   cy.get("input").eq(0).type("9");
   cy.get("input").eq(1).type("9");
   cy.get("input").eq(2).type("9");
   cy.get("input").eq(3).type("9");


   cy.get("button[type='submit']").click();


   cy.wait("@failedOtpRequest");


   cy.get("p.text-red-600", { timeout: 10000 }).should("contain.text", "OTP verification failed");
 });
});


