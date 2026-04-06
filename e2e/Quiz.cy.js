describe('Quiz de Inglês', () => {

  beforeEach(() => {
    cy.visit('https://ingles-qazando.lovable.app/quiz')
  })

  it('Deve responder corretamente e incrementar acertos', () => {

    // Valida se a questão 1 está correta
    cy.contains('1/30').should('be.visible')

    // Clica na resposta correta
    cy.contains('feliz').click()

    // Valida se incrementou os acertos
    cy.contains('Acertos')
      .parent()
      .should('contain', '1')

  })

})