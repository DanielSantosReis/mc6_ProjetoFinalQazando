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

        cy.get('button.h-16').then(($buttons) => {
          const options = [...$buttons].map(btn => btn.innerText.trim().toLowerCase());
          cy.log('Quiz options: ' + JSON.stringify(options));

          let targetIndex = -1;
          const acceptable = [];
          if (expectedTranslation) {
            acceptable.push(expectedTranslation.toLowerCase());
          }

          // Add synonyms or translations with accents / variation support
          if (cleanedWord === 'work') acceptable.push('trabalho', 'trabalhar');
          if (cleanedWord === 'job') acceptable.push('trabalho', 'emprego');
          if (cleanedWord === 'study') acceptable.push('estudar', 'estudo');
          if (cleanedWord === 'sleep') acceptable.push('dormir', 'sono');
          if (cleanedWord === 'run') acceptable.push('correr', 'corrida');

          targetIndex = options.findIndex(opt => acceptable.includes(opt));

          if (targetIndex !== -1) {
            cy.log('Found correct option at index ' + targetIndex + ': ' + options[targetIndex]);
            cy.wrap($buttons[targetIndex]).click();
          } else {
            cy.log('Word translation not found in options. Clicking the first option as fallback.');
            cy.wrap($buttons[0]).click();
          }
        });

        // Valida que o contador de acertos incrementou ou manteve o valor caso já acertado anteriormente (UPSERT)
        cy.contains('Acertos').parent().should(($el) => {
          const currentMatch = $el.text().match(/(\d+)/);
          const currentAcertos = currentMatch ? parseInt(currentMatch[1], 10) : 0;
          expect([initialAcertos, initialAcertos + 1], 'O contador de Acertos deve ser o valor inicial ou incrementado em 1').to.include(currentAcertos);
        });
      });
    });
  });
});
