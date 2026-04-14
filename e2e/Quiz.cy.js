describe('Quiz de Inglês', () => {

  beforeEach(() => {
    cy.visit('https://ingles-qazando.lovable.app/auth')

    cy.get('input[type="email"]').type('admin@teste.com')
    cy.get('input[type="password"]').type('Teste@123')
    cy.contains('Entrar').click()

    cy.contains('Ir para Exercícios').click()

    cy.url().should('include', '/exercises')

    cy.contains('Quiz').click()

    // Espera redirecionar
    cy.url().should('include', '/quiz')
  })

  it('Deve responder corretamente e incrementar acertos', () => {

    // Valida se a questão 1 está correta
    cy.contains('1/30').should('be.visible')

    cy.contains('feliz').click()

    // Valida se incrementou os acertos
    cy.contains('Acertos')
      .parent()
      .should('contain', '1')

  })

  describe('Quiz - carregamento', () => {
    it('Deve carregar a tela do quiz corretamente', () => {
      cy.visit('/quiz')

      cy.contains('Quiz de Inglês').should('be.visible')
      cy.contains('Questão').should('be.visible')
      cy.contains('Acertos').should('be.visible')
      cy.contains('Erros').should('be.visible')
    })
  })

})