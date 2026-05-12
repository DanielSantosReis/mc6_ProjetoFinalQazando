describe("Teste Automatizado", () => {
  it("Deve executar as ações gravadas", () => {
    cy.visit("https://ingles-qazando.lovable.app/duolingo/1/1");
    cy.get(".flex.items-start.gap-6").click();
  });
});
