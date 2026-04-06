describe('Login - Projeto Final MC6', () => {
  beforeEach(() => {
    cy.visit('https://ingles-qazando.lovable.app/');
    cy.contains('Entrar').click();
    cy.url().should('include', '/auth');
  });

  it('Deve fazer login com sucesso usando credenciais válidas', () => {
    cy.get('input[type="email"]').should('be.visible').clear().type('admin@teste.com');
    cy.get('input[type="password"]').should('be.visible').clear().type('Teste@123');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url({ timeout: 10000 }).should('not.include', '/auth');

    cy.contains(/Ir para Exer.*cios/i, { timeout: 10000 }).should('be.visible').click();
  });

  it('Não deve fazer login com email inválido', () => {
    cy.get('input[type="email"]').should('be.visible').clear().type('email-invalido');
    cy.get('input[type="password"]').should('be.visible').clear().type('Teste@123');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });

  it('Não deve fazer login com senha incorreta', () => {
    cy.get('input[type="email"]').should('be.visible').clear().type('admin@teste.com');
    cy.get('input[type="password"]').should('be.visible').clear().type('senha-incorreta');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });

  it('Não deve fazer login com email vazio', () => {
    cy.get('input[type="email"]').should('be.visible').clear();
    cy.get('input[type="password"]').should('be.visible').clear().type('Teste@123');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });

  it('Não deve fazer login com senha vazia', () => {
    cy.get('input[type="email"]').should('be.visible').clear().type('admin@teste.com');
    cy.get('input[type="password"]').should('be.visible').clear();

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });

  it('Não deve fazer login com ambos os campos vazios', () => {
    cy.get('input[type="email"]').should('be.visible').clear();
    cy.get('input[type="password"]').should('be.visible').clear();

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });

  it('Não deve fazer login com usuário inexistente', () => {
    cy.get('input[type="email"]').should('be.visible').clear().type('usuario@inexistente.com');
    cy.get('input[type="password"]').should('be.visible').clear().type('Teste@123');

    cy.contains('button', 'Entrar').should('be.visible').click();

    cy.url().should('include', '/auth');
  });
});