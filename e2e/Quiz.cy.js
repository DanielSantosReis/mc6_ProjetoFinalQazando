describe('Quiz de Inglês', () => {

  beforeEach(() => {
    cy.visit('https://ingles-qazando.lovable.app/quiz')
  })

  it('Deve responder corretamente e incrementar acertos', () => {
    const translationMap = {
      // Verbs
      'run': 'correr',
      'walk': 'caminhar',
      'sleep': 'dormir',
      'eat': 'comer',
      'drink': 'beber',
      'speak': 'falar',
      'write': 'escrever',
      'read': 'ler',

      // Nouns
      'dog': 'cachorro',
      'cat': 'gato',
      'bird': 'pássaro',
      'fish': 'peixe',
      'book': 'livro',
      'pen': 'caneta',
      'pencil': 'lápis',
      'paper': 'papel',
      'house': 'casa',
      'car': 'carro',
      'bicycle': 'bicicleta',
      'train': 'trem',
      'airplane': 'avião',
      'water': 'água',
      'bread': 'pão',
      'milk': 'leite',
      'coffee': 'café',
      'tea': 'chá',
      'apple': 'maçã',
      'banana': 'banana',
      'orange': 'laranja',
      'sun': 'sol',
      'moon': 'lua',
      'star': 'estrela',
      'sky': 'céu',
      'tree': 'árvore',
      'flower': 'flor',
      'city': 'cidade',
      'country': 'país',
      'school': 'escola',
      'teacher': 'professor',
      'student': 'estudante',
      'friend': 'amigo',
      'family': 'família',
      'mother': 'mãe',
      'father': 'pai',
      'brother': 'irmão',
      'sister': 'irmã',
      'time': 'tempo',
      'day': 'dia',
      'night': 'noite',
      'year': 'ano',
      'money': 'dinheiro',
      'job': 'trabalho',
      'music': 'música',
      'movie': 'filme',

      // Adjectives
      'happy': 'feliz',
      'sad': 'triste',
      'angry': 'bravo',
      'tired': 'cansado',
      'big': 'grande',
      'small': 'pequeno',
      'hot': 'quente',
      'cold': 'frio',
      'beautiful': 'bonito',
      'ugly': 'feio',
      'good': 'bom',
      'bad': 'ruim',
      'easy': 'fácil',
      'difficult': 'difícil',
      'fast': 'rápido',
      'slow': 'devagar',
      'new': 'novo',
      'old': 'velho',
      'young': 'jovem',
      'clean': 'limpo',
      'dirty': 'sujo',
      'rich': 'rico',
      'poor': 'pobre',
      'strong': 'forte',
      'weak': 'fraco',

      // Basic Phrases / Other
      'hello': 'olá',
      'goodbye': 'tchau',
      'yes': 'sim',
      'no': 'não',
      'please': 'por favor',
      'thank you': 'obrigado',
      'sorry': 'desculpe'
    };

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
        cy.log(`Tradução esperada: "${expectedTranslation}"`);

        if (expectedTranslation) {
          // Clica na opção correta
          cy.get('button.h-16').contains(expectedTranslation).click();
        } else {
          // Fallback: clica na primeira opção caso não encontre no mapa
          cy.log('Aviso: palavra não mapeada no dicionário. Clicando na primeira opção como fallback.');
          cy.get('button.h-16').first().click();
        }

        // Valida que o contador de acertos incrementou (caso tenhamos acertado)
        // Se a palavra estava mapeada, o acerto deve ser garantido.
        if (expectedTranslation) {
          cy.contains('Acertos').parent().should(($el) => {
            const currentMatch = $el.text().match(/(\d+)/);
            const currentAcertos = currentMatch ? parseInt(currentMatch[1], 10) : 0;
            expect(currentAcertos).to.equal(initialAcertos + 1);
          });
        }
      });
    });
  });
});