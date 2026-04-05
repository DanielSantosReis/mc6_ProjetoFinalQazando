describe('Login - Projeto Final MC6', () => {
  it('Deve fazer login com sucesso usando credenciais válidas', () => {
    cy.visit('https://ingles-qazando.lovable.app/');

    cy.contains('Entrar').click();

    cy.url().should('include', '/auth');

    cy.get('input[type="email"]').should('be.visible').clear().type('admin@teste.com');
    cy.get('input[type="password"]').should('be.visible').clear().type('Teste@123');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url({ timeout: 10000 }).should('not.include', '/auth');

    cy.contains(/Ir para Exer.*cios/i, { timeout: 10000 }).should('be.visible').click();
  });
});