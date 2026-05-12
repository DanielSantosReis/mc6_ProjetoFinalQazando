/// <reference types="cypress" />

describe("Acessar Trilha do inglês", () => {
  beforeEach(() => {
    cy.env(["email", "password"]).then((env) => {
      cy.login(env.email, env.password);
    });

    cy.irParaExercicios();
    cy.acessarTrilhaDoIngles();
  });

  it("Deve acessar trilha do inglês", () => {
    cy.contains("Trilha do Inglês").should("be.visible");
  });

  it("deve exibir os elementos principais da página", () => {
    cy.contains("Trilha do Inglês").should("be.visible");
    cy.contains(
      "Progrida do zero ao avançado através de lições interativas",
    ).should("be.visible");
    cy.contains("Unidade 1").should("be.visible");
    cy.contains("Lição 1").should("be.visible");
  });
});
