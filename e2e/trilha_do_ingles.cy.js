/// <reference types="cypress" />

describe("Acessar Trilha do inglês", () => {
  it("Deve acessar trilha do inglês", () => {
    cy.env(["email", "password"]).then((env) => {
      cy.login(env.email, env.password);
    });

    cy.irParaExercicios();
    cy.acessarTrilhaDoIngles();
  });
});
