# Changelog

## Versão 1.1 - XXXXXXXXXXXXX/07/2022
<ins>Novas features:</ins>
- Adicionada tab de cursos nos agrupamentos de UCs, para ver quais os cursos das UCs agrupadas (informação também visivel na lista neste momento)
- Adicionados links de atalho para UC e Curso quando estamos a ver o detalhe de uma avaliação (caso tenhamos um utilizador com permissões)


<ins>Issues corrigidos:</ins>
- Correção da possibilidade de editar uma avaliação para uma data de uma interrupção, não permitindo overlap
- Correções gerais das permissões de vários utilizadores e da atualização das permissões ao mudar de fase
- Correção de um erro ao ter épocas a terminar e começar no meio da mesma semana (exemplo: Exame normal e Exame recurso)
- Correção de não ser possível ver a marcação de uma avaliação quando havia épocas a acontecer em simultâneo
- Correção do sistema de login com LDAP que não estava a associar os utilizadores ao grupo correto (no caso dos estudantes pelo menos)
- Correção de alguns problemas de traduções que não estavam a vir na linguagem correta
- Correção da publicação quando GOP ou Direção que não estava a ser marcada como definitiva como era suposto.

<ins>Coisas a melhorar/corrigir:</ins>

- Validar permissões de edição de avaliações tendo em conta que
  - Avaliações marcadas pelo GOP apenas devem ser editadas pelo GOP
  - Responsável de UC apenas pode marcar / editar as suas UCs
  - Coordenador de Curso pode marcar e editar sempre a não ser que seja marcada pelo GOP
- Rever quem pode ou não adicionar comentários e se deve estar associado às fases
- Permitir copiar avaliações e métodos de outro calendário
- Permitir copiar avaliações e métodos de outros anos letivos

## Versão 1.0 - 18/07/2022
<ins>Novas features:</ins>
- Adicionadas datas dos exames ao popup de revisão para maior/melhor informação disponível a rever;
- Adicionado botões para validar ou rejeitar caso seja membro do Conselho pedagógico ou membro da direção, em vez de ver o botão para submeter;
- Guardar role do user na local storage, para algumas validações de permissões do calendário;
- Adicionados métodos e logs aos agrupamentos de UCs;
- Adicionada possibilidade de marcar exames para UCs agrupadas
- Revisão do detalhe e de criação de uma UC:
  - Adicionada dropdown para selecionar o curso;
  - Adicionado botão procurar via WebService os detalhes da UC e bloqueio dos campos de edição;
  - Adicionado botão para sincronização/atualização dos dados de uma UC via WebService;
- Adicionada marcação visual para o dia e semana de hoje
- Adicionado link para fazer scroll para a semana atual se existir
- Adicionado mensagem de erro devolvida pelo servidor ao tentar criar/gravar Grupos de utilizadores;
- Adicionado aviso para quando tentamos marcar mais do que uma vez uma avaliação.
- Adicionado redirect para quando é feito um clone de um calendário, redirecionar para o novo calendário clonado.

<ins>Issues corrigidos:</ins>
- Revisão dos date pickers da criação dos calendários:
  - Data de inicio da época normal tem de ser no minimo a data de inicio da época periódica;
  - Data final da época normal tem de ser no minimo a data final da época periódica (ou a data inicial da epoca normal +1);
  - Fazer disable/enable dos campos à medida que vamos preenchendo as datas por época;
- Revisão da da dropdown dos anos letivos quando existe mais do que um ano letivo selecionado;
- Correção de um erro da troca de permissões que acontecia quando abríamos a aplicação pela primeira vez;
- Correção de um erro ao gravar um calendário, este não ficava visivel na listagem de calendários, porque não estava a associar os grupos que tinham permissão para ver;
- Revisão das permissões e publicação dos calendários pelos vários utilizadores;
- Remoção do link para página dos cursos, quando estamos na página dos anos letivos e não fizemos uma sincronização e correção do texto de ajuda que estava errado;
- Revisão do popup de detalhe de uma avaliação, para quando não temos permissões de ver/adicionar comentários ver um popup mais pequeno apenas com os detalhes;
- Revisão das traduções onde estavam em falta
- Revisão do footer e página sobre para adicionar créditos com dados do 1º grupo que começou o projeto e links externos
- Revisão das permissões dos vários utilizadores na aplicação globalmente;
- Revisão da publicação de um calendário: se for o CC, é uma publicação provisória, e cria automaticamente um clone do calendário para continuar a editar.


## Versão 0.9 - 04/07/2022
<ins>Novas features:</ins>
- Adicionada uma nova funcionalidade que permite esconder épocas, permitindo reduzir o calendário visivel
- Adicionada uma nova funcionalidade que permite melhorar a gestão de quem pode ver o calendário ao atualizar a fase do calendário
  - Esta funcionalidade recorre por defeito aos valores das permissões preenchidos nos grupos para cada fase, dando uma maior liberdade para a pessoa que está a fazer a fase de controlar quem pode ver o calendário no momento.
- Adicionados novos filtros na listagem de calendários
- Revista e adicionada novamente a funcionalidade de publicar calendários
  - Caso seja um Coordenador de Curso é publicado como provisório
  - Caso seja o GOP ou a Direção é publicado como definitivo
  - Outros Grupos não deverão ter possibilidade de publicar um calendário
- Revista e adicionada novamente a funcionalidade de copiar calendários após estarem publicados

<ins>Issues corrigidos:</ins>
- Corrigido erro nas migrations da BD, que não permitia reconfigurar a máquina local, devido às alterações recentes da BD;
- Corrigidos alguns erros visuais na listagem, criação e detalhe dos calendários, nomeadamente espaçamentos
- Corrigido erro que não permitia guardar métodos de uma época quando a percentagem do método era 0%;
- Removido peso e percentagem dos métodos adicionados automaticamente quando é selecionado o método "Projeto" (por não fazerem sentido)
- Correção do display da versão dos calendários, e da forma de incrementar uma cópia do calendário, adicionando esse campo na BD
- Correção do visual do popup de alteração da fase do calendário/publicação do calendário para ser mais intuitivo o processo de seleção da fase
- Correções visuais para destacar a coluna da revisão do calendário, e correções das queries para o numero de métodos por preencher
- Revisão de alguns textos de ajuda nas interações dos utilizadores
- Revisão das traduções de mais alguns textos nos calendários

<ins>Coisas a melhorar/corrigir:</ins>
- Automatizar a duplicação do calendário quando o CC publica um calendário provisório, e atualização da página para o novo calendário duplicado, para que este possa continuar a trabalhar
- Adicionar avisos quando marcamos 2 vezes a mesma avaliação
- Ao adicionar uma interrupção e eliminar avaliações contínuas, dividir a avaliação em 2 e apaga apenas o dia selecionado para a interrupção
- Verificar as permissões, garantindo que o utilizador apenas pode editar os calendários de um curso ao qual pertence, ou que não consegue ver informações a que não deveria ter acesso
- Rever e corrigir Policies para garantir que do lado do servidor todos os pedidos são validados da forma correta
- Ao publicar um calendário, confirmar se uma UC que tenha sido iniciada a marcação dos elementos de avaliação, tem todos os métodos preenchidos, e caso não tenha, dar erro para o utilizador marcar todos os métodos. 
- Detalhe de exame fica com espaço vazio caso não possa ver os comentários
- Rever a forma de preenchimento dos métodos em UCs Agrupadas
- Possibilidade de selecionar quais os responsáveis de UCs ou quais as UC's que devem ter permissões para marcar as datas de avaliações das suas UCs

<ins>Outras Notas:</ins>
- Início dos testes e correções com diferentes utilizadores para garantir a consistência das interações consoante os diferentes roles
- Algum trabalho no relatório, e criação de uma pasta com screenshots do projeto inicialmente fornecido, para comparação.

## Versão 0.8 - 21/06/2022
Novas features: 
- Adicionar possibilidade de gestão dos novos campos do webservice no detalhe da escola
- Adicionar forma de automaticamente incluir o lançamento de enunciados e apresentação oral, se for selecionado projeto como método de avaliação
- Adicionar link para voltar para a lista de calendários quando estamos no detalhe ou criação de calendário
- Adicionar aviso visual para ser fácil identificar que faltam marcar avaliações para algumas UCs
  - Criação de novo endpoint na API para mostrar o estado das avaliações marcadas e das UCs
  - Adicionado Popup para listar quando métodos estão em falta de cada UC e qual o estado de cada elemento de avaliação.
- Criação de forma de ver quando existem épocas em datas sobrepostas
  - Revisão visual do calendário
  - Revisão do popup de marcação de avaliações para receber a epoca selecionada por defeito quando é escolhido através do calendário
  - Revisão de issue em relação às interrupções, em que criava duas vezes a mesma interrupção por ter mais do que uma época na mesma data
- Adicionada uma flag na BD, nas fases de calendário, para poder dinamicamente escolher quais as fases que têm de ter todos os elementos de avaliação de todas as UCs marcados antes de poderem ser selecionadas/ativadas


Issues corrigidos: 
- Correções de algumas labels / textos a pedido dos professores
- Correção da descrição dos métodos que não estava a ser enviada para a dropdown de selecção do elemento de avaliação
- Atualização para incluir texto de forma a mostrar quando uma avaliação é realizada em Aula
- Voltar a colocar Data de Início e de Fim em inputs separados, em vez do RangePicker para ser mais intuitivo para os utilizadores
- Rever validações das datas na criação do calendário, de forma a melhor a interação dos date pickers entre si
- Criação de método para atualizar o calendário novamente quando uma UC é atualizada
- Correções e otimizações do load das permissões no calendário para melhor performance



## Versão 0.7 - 14/06/2022
Novas features: 
- Criada nova API para expor os dados das avaliações marcadas na plataforma para outras aplicações consumirem (apenas para calendários publicados)
- Update da sincronização do webservice - agora traz a informação completa (em PT e EN) dos cursos e UCs
- Adicionar aviso visual caso uma avaliação esteja a ser marcada para mais de 1 semana

Issues corrigidos: 
- Fix do issue visual componente sticky na tabs dos métodos
- Remoção da possibilidade de duplicar a época periódica (a pedido dos professores)
- Correções nas validações de datas na criação de um calendário


## Versão 0.6 - 04/06/2022
Novas features: 
- Adicionar comentários
- Esconder comentários
- Eliminar comentários (durante os 1ºs 15min)
- Adicionaram-se filtros na página de lista e criação de calendários
- Foi adicionada a opção de selecionar qual a 10ª semana de aulas (pré-calculada)
- Foi acrescentado um campo para a descrição dos métodos de avaliação, que é automaticamente preenchido tendo em conta o tipo de método que está a ser marcado.

Issues corrigidos: 
- Foi melhorada a feature de duplicar metodos e para poder ir gravar sem ter os métodos todos preenchidos
    - Os botões de guardar e duplicar ficaram também sticky, de forma a podermos ir fazendo scroll e continuar a ver os botões sempre disponíveis no ecrã)
- Foi retirada a opção de poder criar calendários para todos os cursos
- Foi melhorada a forma de selecionar e desselecionar os cursos para os quais queremos criar o calendário
- Foi melhorado de forma geral o processo criação de calendário
    - Adicionadas validações nas datas
    - Adicionados mais alertas visuais para as interrupções "obrigatórias"
    - Trocado o componente para DateRange para ser mais fácil selecionar o periodo das épocas
- Foi melhorada a marcação de avaliações
    - Adicionadas opções para avaliações que precisem de mais do que 1 dia (start e end date)
    - Adicionada opção para selecionar quando a avaliação é realizada na aula
    - Foi melhorado a seleção de UCs e métodos de avaliação ao marcar o exame: 
        - Agora é possível ver todas as UCs do curso e do semestre a que estamos a marcar
        - Caso não tenha métodos aparece o aviso e não pode selecionar
        - Caso existam métodos por marcar, aparce um aviso com um atalho para a lista de UCs do curso, onde podem adicionar os métodos
    - Foram retiradas outras validações que tinham sido colocadas pelo antigo grupo, como apenas poder ter uma avaliação por dia, ou ser obrigatório colocar a hora.
- Foi melhorada a página de detalhe de calendário
    - Foi criada uma distinção visual para avaliações em aula e avaliações não em aula (quando visualizamos o calendário)
    - Foi alterada a informação mostrada na avaliação do calendário 
        - Caso não tenha iniciais, aparece o nome completo da UC em vez de "null"
        - Em vez do tipo de avaliação, agora aparece a descrição da avaliação (com base na atualização dos métodos)
        - Foi adicionada uma "tooltip" com o nome completo da UC e descrição da UC (caso o texto seja grande e fique cortado) que aparecer ao fazer hover na avaliação.
    - Foi adicionada a possibilidade de adicionar interrupções em dias que já têm avaliações marcadas (sendo que as avaliações são eliminadas)
- A nível de BD, foi revista a forma como os Cursos e UCs se relacionavam com o ano letivo, as fases de calendários e as permissões foram limpas para a maioria dos utilizadores.


Features/issues ainda pendentes: 
- Ir buscar os dados do sigla e nome inglês do novo webservice (QUANDO FOR DISPONIBILIZADO)
- Melhorar diferença visual das épocas
- Ao adicionar uma interrupção numa avaliação contínua, só deve apagar o dia a escolhido e não todos os dias da avaliação
- Automatizar melhor o processo de projetos e trabalhos (obrigatório calendarizar data de lançamento dos enunciados, entrega do projeto e apresentação/defesa)
- Nas UCs agrupadas, os Coordenadores de Curso podem marcar grupos apenas para as UCs dos seus cursos (ex: EI PL e D)
- Rever todas as funcionalidades para cada grupo de permissões e validar que está tudo a funcionar como definido no fluxo inicial.


## Versão 0.5 - 24/05/2022

Novas features: 
- No detalhe das UCs:
    - Adicionar uma opção para duplicação dos métodos de avaliação entre épocas
    - Remoção da obrigatoriedade de preencher todos os métodos de uma vez para poder guardar.
- Na listagem de calendários:
    - Adicionados filtros na página de lista de calendários
- Na criação de calendário:
    - Adicionar forma de definir a 10ª semana de aulas na criação do calendário
- No detalhe de calendário:
    - Automatização da marcação de avaliações, selecionando a epoca pretendida ao inicio se for apenas uma
    - Finalização do Popup de marcação/edição de avaliações
    - Adicionar opção para remover exames marcados
    - Criação do Popup de adicionar / editar interrupções caso não existam exames marcados
- Atualização de traduções nos métodos e calendário

Issues corrigidos: 
- Retirada a opção de criação de calendário para todos os cursos de uma vez, a pedido dos professores
- Correções em alguns textos da aplicação, especialmente troca de "mandatório" por "obrigatório"
- Adicionar e corrigir warnings na criação do calendário, quando não adicionamos interrupções obrigatórias
- Remover cursos sem "grau de ensino" (Inglês Geral e Matemática Geral) da listagem de cursos


## Versão 0.4 - 17/05/2022

- Adicionar páginas de 404 e RickRoll plugin no servidor
- Added server logs viewer, to help understand issues on server sync requests
- Update e validação de toda a estrutura base relacionada com os agrupamentos de UCs
- Update dos detalhes de curso e UCs para adicionar readonly/disabled nos campos que vêm do WebService.
- Continuação da limpeza e organização da informação das várias ações do detalhe do calendário (adicionar exames/interrupções e visualizar)
- Pequenos updates gerais para correções no processo de marcação de Avaliações e definição dos métodos


## Versão 0.3 - 10/05/2022

- Melhoramento e adicionar mensagens de erro (e traduções) pela aplicação de forma geral
- Detalhe das Unidades Curriculares
    - Refatorização da UI para melhor aproveitamento do espaço
    - Atualização das tabelas
- Separação dos Agrupamentos de UCs das UCs
    - Atualização e criação das permissões em separado
    - Update da UI do menu para mostrar os menus conforme as novas permissões
- Adicionar campo "obrigatório" para tipos de interrupções, para a criação de um calendário
    - Melhoramento do processo de criação de calendário tendo em conta este novo campo
- Mostrar o ano selecionado no menu de navegação
- Limpeza de código dos resources do servidor
- Adicionar mais mensagens de erro e validações no processo de criação de calendário
- Update da forma de trabalhar local para trabalhar no WSL, e tornar a app mais rápida localmente
- Reorganização da informação da página de detalhe do calendário
    - Limpar sidebar
    - Adicionar barra sticky em cima com as infos do calendário
    - Limpeza e divisão de código da página de detalhe em vários componentes mais pequenos.

## Versão 0.2 - 26/04/2022

- Pequenos problemas do servidor e sync de ambos os semestres numa tarefa de cron
- Updates ao layout base, header e navegação
- Traduções de mais algumas paginas
- Rework das páginas de detalhe das UCs & criação do mecanismo de Logs
- Update do código da conexão ao LDAP para melhor performance
- Adicionar popup para confirmar que quer eliminar uma UC
- Adicionar algumas informações dos cursos e UCs aos seeders (porque não era possível sincronizar normalmente)
- Melhorar o flow de criação de calendário, e remover o 4º step (extras) que não estava a ser bem aplicado
- Pequenas correções na página do calendário para ser possível abrir
- Criação do mapeamento das iniciais do curso ao fazer a sincronização (porque não existe essa informação no WebService)
- Refatorização do processo de configuração dos métodos das UCs
    - Adicionar os sliders nos métodos
- Adicionar warnings nas tabelas em que identificamos que faltam informações (UCs e Cursos)


## Versão 0.1 - 19/04/2022

- Reconhecimento do projeto, instalação e configuração em ambiente local
- Atualização do código base para Laravel 9 e React 17
- Validação das funcionalidades do projeto existentes e problemas
- Resolução e refatorização base das várias páginas e menus de configurações de administração
- Atualizações base na UI para melhorar alguns problemas visuais do layout
- Revisão da estrutura da BD e atualização dos ficherios de Migrations e Seeders do Laravel, para atualização mais fácil da VM
- Atualização da BD para possibilidade de ter 2 idiomas (PT e EN)
- Revisão do código de sincronização dos cursos e do LDAP para autenticação
- Melhoramentos de performance na forma de carregamento dos ficheiros/componentes React


## Versão 0.0 - 04/03/2022

- Início do projeto
