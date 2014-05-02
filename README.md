tsminesweeper
=============

**Campo Minado em TypeScript**

Versão web (Javascript) do jogo Campo Minado que vinha nas versões mais antigas do Windows. A primeira versão desse jogo foi criada por Curt Johnson, originalmente para OS/2, e portada para o Microsoft Windows por Robert Donner. Maiores detalhes ver http://en.wikipedia.org/wiki/Microsoft_Minesweeper

Este projeto tem como objetivo servir como treinamento na linguagem TypeScript como ferramenta de desenvolvimento web, através do Microsoft Visual Studio 2013. O TypeScript foi incorporado ao Visual Studio a partir do Update 2 (atualmente em versão RC2).

Releases
========

O jogo está disponível online em http://aldinei.azurewebsites.net/

Versão 0.1.8 (26/04/2014)
-------------------------
- Visualização de tempo decorrido modificada para o formato de hora 00:00 (minutos:segundos)
- Incluída opção de jogo automático
- Corrigido erro de javascript ao abrir quadro com mina quando a opção de dica está desabilitada
- Incluído um fundo esverdeado para quadros abertos que não tenham mina

Versão 0.1.7 (19/04/2014)
-------------------------
- Issue #1 (novidade): Incluída opção "Customizado" na janela de opções. Essa opção permite ao usuário escolher o tamanho do tabuleiro e o número de minas
- Issue #5 (melhoria): A oção "Dica" agora é capaz de fazer dois tipos de sugestões: verde ou vermelha; sugestões verdes indicam que o quadro pode ser aberto com segurança e sugestões vermelhas indicam que o quadro contém uma mina
- As opções escolhidas pelo usuário agora são salvas na localStorage
- Incluído checkbox "Exibir opção de dicas" na janela de opções; isso permite ativar ou desativar o botão "Dica"

Versão 0.1.5 (18/04/2014)
-------------------------
- Issue #3 (novidade): Incluída opção "Dica" (botão com o ícone da lâmpada, que sugere um quadro que pode ser aberto com segurança, a partir das bombas que tiverem sido marcadas com bandeiras)
- Issue #3 (melhoria): Revisto o desenho geral do tabuleiro e das opções

Versão 0.1.4 (17/04/2014)
-------------------------
- Issue #2 (novidade): Incluída opção "Impedir fim de jogo no primeiro clique", ativada por padrão
