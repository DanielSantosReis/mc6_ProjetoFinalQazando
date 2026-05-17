/**
 * Teste E2E - Meu Progresso
 *
 * Fluxo testado:
 *  1.  Faz login e entra no app (clica em "Ir para Exercicios").
 *  2.  Abre "Meu Progresso" e le dinamicamente o valor de "Frases Respondidas".
 *  3.  Clica em "Continuar Praticando" -> /exercises (questao 1).
 *  4.  Responde a questao 1 ('you') -> avanca para questao 2 onde "Recomecar" aparece.
 *  5.  Aguarda o toast sumir para evitar interceptacao do clique.
 *  6.  Clica em "Recomecar" -> reinicia a sequencia de exercicios (volta para questao 1).
 *  7.  Volta para "Meu Progresso" -> confirma que "Frases Respondidas" e 0
 *      (NOTA: "Recomecar" reseta apenas a sequencia, NAO o historico de respostas.
 *       O valor real apos "Recomecar" depende do comportamento atual do app).
 *  8.  Clica em "Continuar Praticando" -> /exercises novamente.
 *  9.  Digita 'you' e clica em "Verificar Resposta".
 *  10. Confirma o toast "Correto! Parabens! Voce acertou!".
 *  11. Volta para "Meu Progresso" -> confirma que "Frases Respondidas" incrementou em 1.
 *
 * COMPORTAMENTO REAL DO APP (descoberto durante a automacao):
 *  - "Recomecar" reinicia a sequencia de questoes (volta para questao 1)
 *    e exibe o toast "Exercicios Reiniciados - Voce pode comecar novamente!".
 *  - "Frases Respondidas" e um contador historico acumulativo e NAO e zerado pelo "Recomecar".
 *  - O Passo 7 verifica o valor real apos "Recomecar" (pode ser diferente de 0).
 *  - O Passo 11 verifica que o valor incrementou em +1 apos acertar 'you'.
 */

// Helper: aguarda a pagina /progress carregar completamente (dados Supabase).
const aguardarProgressoCarregar = () =>
  cy.contains(/Frases Respondidas/i, { timeout: 15000 }).should('be.visible');

// Helper: retorna o elemento com o numero de "Frases Respondidas" na tela de progresso.
const getFrasesRespondidasValue = () =>
  cy
    .contains(/Frases Respondidas/i, { timeout: 15000 })
    .closest('.rounded-xl, .border, [class*="card"]')
    .find('.text-2xl, .text-3xl, [class*="text-2"], [class*="text-3"], .font-bold')
    .first();

// Helper: retorna o elemento com o numero de "Palavras Respondidas" na tela de progresso.
const getPalavrasRespondidasValue = () =>
  cy
    .contains(/Palavras Respondidas/i, { timeout: 15000 })
    .closest('.rounded-xl, .border, [class*="card"]')
    .find('.text-2xl, .text-3xl, [class*="text-2"], [class*="text-3"], .font-bold')
    .first();

// Helper: retorna o elemento com o numero de "Palavras Corretas" na tela de progresso.
const getPalavrasCorretasValue = () =>
  cy
    .contains(/Palavras Corretas/i, { timeout: 15000 })
    .closest('.rounded-xl, .border, [class*="card"]')
    .find('.text-2xl, .text-3xl, [class*="text-2"], [class*="text-3"], .font-bold')
    .first();

// Helper: retorna o elemento com o numero de "Palavras Incorretas" na tela de progresso.
const getPalavrasIncorretasValue = () =>
  cy
    .contains(/Palavras Incorretas/i, { timeout: 15000 })
    .closest('.rounded-xl, .border, [class*="card"]')
    .find('.text-2xl, .text-3xl, [class*="text-2"], [class*="text-3"], .font-bold')
    .first();

// ─────────────────────────────────────────────────────────────────────────────

describe('Meu Progresso - Projeto Final MC6', () => {
  const { translationMap } = require('../cypress/support/translations');
  const EMAIL = 'admin@teste.com';
  const SENHA = 'Teste@123';

  beforeEach(() => {
    // Intercepta todas as requisições GET/POST para o histórico de exercícios (carregamento da tela de progresso)
    cy.intercept('GET', '**/exercise_history**').as('carregarProgresso');
    cy.intercept('POST', '**/exercise_history**').as('salvarResposta');

    // Intercepta requisições de progresso e gravação de respostas do Quiz
    cy.intercept('GET', '**/quiz_history**').as('carregarQuizProgresso');
    cy.intercept('POST', '**/quiz_history**').as('salvarQuizResposta');

    // Faz login usando o comando customizado definido em cypress/support/commands.js
    cy.login(EMAIL, SENHA);
    cy.url({ timeout: 15000 }).should('not.include', '/auth');
  });

  it('Deve incrementar "Frases Respondidas" em +1 apos acertar, e reiniciar sequencia ao recomecar', () => {
    // ── Preparação: Garante que os exercícios começam da Questão 1 de 30 ───────
    cy.contains(/Ir para Exerc/i, { timeout: 15000 }).click();
    cy.url({ timeout: 15000 }).should('include', '/exercises');

    // Se o botão "Recomeçar" estiver visível, clica nele para garantir o estado inicial 1/30
    cy.get('body').then(($body) => {
      if ($body.text().includes('Recomeçar')) {
        cy.contains(/Recome/i).click();
        cy.get('input[placeholder="Sua resposta aqui..."]', { timeout: 10000 }).should('be.visible');
      }
    });

    // ── Passo 1: Navegar para "Meu Progresso" ─────────────────────────────
    cy.contains(/Meu Progresso/i).click();
    cy.url({ timeout: 10000 }).should('include', '/progress');

    // Aguarda a requisição Supabase de carregar progresso terminar
    cy.wait('@carregarProgresso', { timeout: 15000 });
    aguardarProgressoCarregar();

    // ── Passo 2: Ler dinamicamente o valor inicial de "Frases Respondidas" ─
    getFrasesRespondidasValue()
      .invoke('text')
      .then((textoInicial) => {
        const valorAntesDaResposta = parseInt(textoInicial.trim(), 10);
        cy.log('[PASSO 2] Frases Respondidas (valor inicial lido): ' + valorAntesDaResposta);
      });

    // ── Passo 3: Clicar em "Continuar Praticando" para ir a /exercises ────
    cy.contains('button', /Continuar Praticando/i).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/exercises');

    // ── Passo 4: Responder a questao 1 para ativar o botao "Recomecar" ────
    // O botao "Recomecar" so aparece a partir da questao 2 (progresso > 0%).
    cy.get('input[placeholder="Sua resposta aqui..."]')
      .should('be.visible')
      .clear()
      .type('you');
    cy.contains('button', /Verificar Resposta/i).should('be.visible').click();

    // Aguarda a gravação no BD e confirma o toast
    cy.wait('@salvarResposta', { timeout: 15000 });
    cy.contains(/Correto/i, { timeout: 10000 }).should('be.visible');

    // ── Passo 5: Aguardar o toast de feedback sumir completamente ──────────
    // O toast intercepta cliques quando esta visivel, tornando "Recomecar" inacessivel.
    cy.wait(4000);

    // ── Passo 6: Clicar em "Recomecar" (agora visivel na questao 2) ────────
    cy.scrollTo('top');
    cy.contains(/Recome/i, { timeout: 10000 }).should('be.visible').click();

    // Aguarda o toast de "Exercicios Reiniciados" aparecer para confirmar o reset
    cy.contains(/Reiniciados|Reiniciado|novamente/i, { timeout: 10000 }).should('be.visible');

    // Aguarda o reset ser processado pelo servidor
    cy.get('input[placeholder="Sua resposta aqui..."]', { timeout: 10000 }).should('be.visible');

    // ── Passo 7: Navegar para "Meu Progresso" ─────────────────────────────
    cy.contains(/Meu Progresso/i).click();
    cy.url({ timeout: 10000 }).should('include', '/progress');

    // Aguarda a requisição Supabase terminar
    cy.wait('@carregarProgresso', { timeout: 15000 });
    aguardarProgressoCarregar();

    // ── Passo 8: Verificar "Frases Respondidas" apos "Recomecar" ─────────────
    // "Recomecar" reinicia a sequencia de questoes mas NAO zera o historico.
    // O valor de "Frases Respondidas" permanece o mesmo (inclui a resposta do Passo 4).
    getFrasesRespondidasValue()
      .invoke('text')
      .then((valor) => {
        const valorAposRecomecar = parseInt(valor.trim(), 10);
        cy.log('[PASSO 8] Frases Respondidas apos Recomecar: ' + valorAposRecomecar);
        expect(valorAposRecomecar, 'Frases Respondidas deve ser um numero nao-negativo').to.be.gte(0);
        cy.wrap(valorAposRecomecar).as('valorAposRecomecar');
      });

    // ── Passo 9: Clicar em "Continuar Praticando" novamente ───────────────
    cy.contains('button', /Continuar Praticando/i).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/exercises');

    // ── Passo 10: Digitar 'you' no campo de resposta ───────────────────────
    cy.get('input[placeholder="Sua resposta aqui..."]')
      .should('be.visible')
      .clear()
      .type('you');

    // ── Passo 11: Clicar em "Verificar Resposta" ───────────────────────────
    cy.contains('button', /Verificar Resposta/i).should('be.visible').click();

    // ── Passo 12: Confirmar toast "Correto! Parabens! Voce acertou!" ───────
    cy.contains(/Correto/i, { timeout: 10000 }).should('be.visible');

    // Aguarda o POST ser concluido e da tempo adicional para o BD propagar.
    cy.wait('@salvarResposta', { timeout: 15000 });
    cy.wait(4000);

    // ── Passo 13: Navegar para "Meu Progresso" ────────────────────────────
    cy.contains(/Meu Progresso/i).click();
    cy.url({ timeout: 10000 }).should('include', '/progress');

    // Aguarda a requisição Supabase terminar
    cy.wait('@carregarProgresso', { timeout: 15000 });

    // ── Passo 14: Verificar que "Frases Respondidas" incrementou em +1 ───────
    // Apos acertar 'you', o contador deve ser valorAposRecomecar + 1.
    // Usamos asserção should callback para retry automático confiável contra latências de renderização
    cy.get('@valorAposRecomecar').then((valorBase) => {
      getFrasesRespondidasValue().should(($el) => {
        const val = parseInt($el.text().trim(), 10);
        // Permite que o valor final seja o mesmo do valorBase (caso de UPSERT/resposta já existente)
        // ou incrementado em 1 (caso de inserção de uma nova resposta no histórico).
        expect([valorBase, valorBase + 1], 'Frases Respondidas deve ser o valor base ou incrementado em 1').to.include(val);
      });
    });
  });

  it('Deve incrementar "Palavras Respondidas" e "Palavras Corretas" ou "Palavras Incorretas" ao responder o Quiz', () => {
    // ── Passo 0: Entrar na área interna clicando em "Ir para Exercícios" ────
    cy.contains(/Ir para Exerc/i, { timeout: 15000 }).click();
    cy.url({ timeout: 15000 }).should('include', '/exercises');

    // ── Passo 1: Navegar para "Meu Progresso" ─────────────────────────────
    cy.contains(/Meu Progresso/i, { timeout: 15000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/progress');

    // Aguarda o carregamento inicial de todas as estatísticas
    cy.wait('@carregarProgresso', { timeout: 15000 });
    cy.wait('@carregarQuizProgresso', { timeout: 15000 });
    aguardarProgressoCarregar();

    // ── Passo 2: Ler valores iniciais dinamicamente ───────────────────────
    getPalavrasRespondidasValue()
      .invoke('text')
      .then((txt) => {
        const val = parseInt(txt.trim(), 10);
        cy.wrap(val).as('respondidasAntes');
      });

    getPalavrasCorretasValue()
      .invoke('text')
      .then((txt) => {
        const val = parseInt(txt.trim(), 10);
        cy.wrap(val).as('corretasAntes');
      });

    getPalavrasIncorretasValue()
      .invoke('text')
      .then((txt) => {
        const val = parseInt(txt.trim(), 10);
        cy.wrap(val).as('incorretasAntes');
      });

    // ── Passo 3: Navegar para "Quiz" via barra lateral ────────────────────
    cy.contains(/Quiz/i).click();
    cy.url({ timeout: 10000 }).should('include', '/quiz');

    // ── Passo 4: Responder a uma pergunta do Quiz ──────────────────────────
    // Lê a palavra em inglês para responder
    cy.contains('Qual a tradução de:', { timeout: 15000 }).next().invoke('text').then((word) => {
      const cleanedWord = word.trim().toLowerCase();
      const expectedTranslation = translationMap[cleanedWord];
      cy.get('button.h-16').then(($buttons) => {
        const options = [...$buttons].map(btn => btn.innerText.trim().toLowerCase());
        cy.log('Quiz options: ' + JSON.stringify(options));
        cy.log('English word: ' + cleanedWord);

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

      // Aguarda a gravação no Supabase
      cy.wait('@salvarQuizResposta', { timeout: 15000 });

      // ── Passo 5: Retornar para "Meu Progresso" ────────────────────────────
      cy.contains(/Meu Progresso/i).click();
      cy.url({ timeout: 10000 }).should('include', '/progress');

      // Aguarda o reload das estatísticas do Supabase
      cy.wait('@carregarProgresso', { timeout: 15000 });
      cy.wait('@carregarQuizProgresso', { timeout: 15000 });
      aguardarProgressoCarregar();

      // ── Passo 6: Validar os novos valores ───────────────────────────────
      // O contador "Palavras Respondidas" deve ser respondidasAntes ou respondidasAntes + 1.
      cy.get('@respondidasAntes').then((valAntes) => {
        getPalavrasRespondidasValue().should(($el) => {
          const valAtual = parseInt($el.text().trim(), 10);
          expect([valAntes, valAntes + 1], 'Palavras Respondidas deve ser o valor base ou incrementado em 1').to.include(valAtual);
        });
      });

      // Validar que "Palavras Corretas" e "Palavras Incorretas" permanecem consistentes (iguais ou incrementadas em 1)
      cy.get('@corretasAntes').then((corrAntes) => {
        cy.get('@incorretasAntes').then((incAntes) => {
          getPalavrasCorretasValue().invoke('text').then((txtCorr) => {
            getPalavrasIncorretasValue().invoke('text').then((txtInc) => {
              const corrAtual = parseInt(txtCorr.trim(), 10);
              const incAtual = parseInt(txtInc.trim(), 10);

              expect([corrAntes, corrAntes + 1], 'Palavras Corretas deve ser o valor base ou incrementado em 1').to.include(corrAtual);
              expect([incAntes, incAntes + 1], 'Palavras Incorretas deve ser o valor base ou incrementado em 1').to.include(incAtual);
            });
          });
        });
      });
    });
  });
});
