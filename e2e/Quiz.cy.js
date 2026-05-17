describe('Quiz de Inglês', () => {
  const { translationMap } = require('../cypress/support/translations');

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
    // Lê os acertos iniciais
    cy.contains('Acertos', { timeout: 15000 }).parent().invoke('text').then((acertosText) => {
      const match = acertosText.match(/(\d+)/);
      const initialAcertos = match ? parseInt(match[1], 10) : 0;
      cy.log(`Acertos iniciais: ${initialAcertos}`);

      // Lê a palavra em inglês para traduzir
      cy.contains('Qual a tradução de:').next().invoke('text').then((word) => {
        const cleanedWord = word.trim().toLowerCase();
        cy.log(`Palavra encontrada: "${cleanedWord}"`);

        const expectedTranslation = translationMap[cleanedWord];
        expect(expectedTranslation, `Palavra não mapeada no dicionário: "${cleanedWord}"`).to.exist;
        cy.log(`Tradução esperada: "${expectedTranslation}"`);

        // Clica na opção correta
        cy.get('button.h-16').contains(expectedTranslation).click();

        // Valida que o contador de acertos incrementou
        cy.contains('Acertos').parent().should(($el) => {
          const currentMatch = $el.text().match(/(\d+)/);
          const currentAcertos = currentMatch ? parseInt(currentMatch[1], 10) : 0;
          expect(currentAcertos).to.equal(initialAcertos + 1);
        });
      });
    });
  });
});
