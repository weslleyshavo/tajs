import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then("The inputs should be cleared", () => {
  registerForm.elements.titleInput().should("have.value", "");
  registerForm.elements.imageUrlInput().should("have.value", "");
});
