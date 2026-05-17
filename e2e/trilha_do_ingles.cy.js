/// <reference types="cypress" />

describe("Acessar Trilha do inglês", () => {
  it("Deve acessar trilha do inglês", () => {
    cy.login("admin@teste.com", "Teste@123");

    cy.irParaExercicios();
    cy.acessarTrilhaDoIngles();
  });
});
