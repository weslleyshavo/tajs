import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "./registerForm.cy.js";

Given("I am on the image registration page", () => {
  cy.visit("/");
});
When("I enter {string} in the title field", (text) => {
  registerForm.typeTitle(text);
});
Then("I enter {string} in the URL field", (text) => {
  registerForm.typeUrl(text);
});
Then("I click the submit button", () => {
  registerForm.clickSubmit();
});
Then("I can hit enter to submit the form", () => {
  cy.focused().type("{enter}");
});
