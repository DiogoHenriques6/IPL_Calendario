# TODO

> Lista Calendarios
- [ ] Listar "todos" os calendarios, so deve devolver os publicados (definitivos ou temporarios)

> Detalhe Calendario
- [ ] filtrar UCs num calendario, que esteja neste WebService
  > http://www.dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/inscricoes_cursos_json.php?anoletivo=202122&cod_curso=9119&cod_aluno=2192779

- [ ] Se for um curso sem tipo, mostra a opcao de exportar as avaliacoes para outros calendarios criados, e a opcoa de selecionar as avaliacoes criadas
    - [ ] Filtragem de UCs
        - [ ] Filtrar por UC associada a um aluno

**old**
- [ ] Copiar avaliacoes de outro Calendario (apenas para o ano letivo corrente, e se tiver ja algum avaliacao daquela UC/ ou algo do genero)
    - [ ] Copiar apenas avaliacoes da UC especifica (?) (ex: pos laboral e diurno)
    - [ ] Copiar todos os avaliacoes (GOP?)
    - [ ] Copiar todos os avaliacoes (CC?)
        - [ ] Talvez mostrar um popup com a lista das UCs que podem ser copiadas e depois selecionar todas
        - [ ] Mostrar um aviso/disabled caso exista conflito com alguma existente (poder mudar a data?)
            - validar forma a fazer isto (???)

- [ ] Validar quando e o responsavel da UC e nao deixar editar as outras cadeiras senao as deles
    - Perguntar se: (logica de pensamento)
    - [ ] o GOP pode editar qualquer avaliacao
        - [ ] O Coordenador de Curso so editar as suas cadeiras do curso
            - [ ] O Responsavel da UC so pode editar as da sua cadeira
                - [ ] Se qualquer docente da cadeira pode editar os avaliacoes
                - [ ] Se apenas quem criou pode editar (ou seja, mesmo sendo da mesma cadeira, nao pode mexer)
        - [ ] o GOP pode editar em qualquer altura/qualquer avaliacao, mesmo sendo outros a criar

- [ ] Validar permissoes de Responsavel UC do que pode ver no calendario e na lista (ex: campo do estado do calendario)

- [ ] Validar quando se marca um avaliacao, se for dos agrupados, deixar marcar para os outros. (validar bug)

- [ ] Validar avaliacoes que sao gop e user nao e gop (validar se grupo por eliminar)
- [ ] Validar se avaliacao nao esta em cima de interrupcao (validar/melhorar)
- [X] Rever mudança de fases num CP ou Direção (aceitar e recursar)
    - [ ] Validar se esta completo
- [X] Rever quem pode ver detalhe de UC
- [ ] Rever quem pode ou não adicionar comentários e se deve estar associado às fases


> UCs Agrupadas
- [ ] ao marcar uma avaliacao, ira marcar nos calendarios dos cursos que estao associados a essa UC agrupada

**old**
- [X] Copiar Metodos de outras cadeiras (talvez popup com pesquisa de UC e ano letivo (deixar de anos anteriores))
  - [ ] Confirmar exames no calendario se nao existe conflito entre calendarios

> Todas as paginas
- [ ] Rever traduções
- [ ] Adicionar titulo as paginas

> Qualquer Lista
- [ ] validar os filtros


# Done - Last Push

> Login
- [X] Validar anos quando entramos e somos associados a um curso


> sync webservice
- [X] adicionar o ramo [0,1,2]
  - [X] adicionar no sync (ramo 1, ramo 2, ramo 3, ...)
  - [X] poder editar nomes dos ramos no detalhe do curso

- [X] adicionar inscritos, aprovados e reprovados (UCs)
  - [X] Adicionar campos na tabela da bd
  - [X] Adicionar campos de sync na tabela da escola
  - [X] Adicionar registo no sync 


> Metodos
- [X] copiar metodos de outros anos
- [X] copiar de outros cursos (ex: D/PL)


> Publicacao de Calendario
- [X] Enviar email
    - Enviar so para estudantes, ou tambem para os professores?


> Listagem de UCs
- [X] Adicionar Ano de UC na lista (lista ucs e lista de ucs no curso)
    - [X] Adicionar ano letivo onde acharmos necessario para distinguir a cadeira

- [X] Na listagem, os agrupamentos não mostra nada. Parece que não vem do servidor o "group_name"


> criacao calendario
- [X] avisar caso curso ja tenha calendario
    - Mostra se tem calendario para o ano letivo e para a epoca escolhida
- [X] adicionar os cursos sem tipo de curso
    - Adicionada opcao "Sem curso"
- [X] selecionar todos os cursos (filtrados)

> detalhe calendario
- [X] Adicionar ICS quando se ve detalhe de avaliacao

---
## Issues

**Trabalho futuro?:**
- [ ] Adicionar possibilidade de ver os cursos no detalhe de uma UC Agrupada
- [ ] Possibilidade de ver as diferenças entre calendários de avaliação
- [ ] Se for Direção ou Conselho Pedagógico, se rejeitar um calendário devem poder adicionar um comentário/parecer
- [ ] Adicionar possibilidade de filtrar por UCs no detalhe do calendário (para escolher quais as UC's a ver no calendário)
- [ ] Ao publicar um calendário, confirmar se uma UC que tenha sido iniciada a marcação dos elementos de avaliação, tem todos os métodos preenchidos, 
    e caso não tenha, dar erro para o utilizador marcar todos os métodos. 
- [ ] Ao adicionar uma interrupção e eliminar avaliações contínuas, dividir a avaliação em 2 e apaga apenas o dia selecionado para a interrupção
  - [X] Campo na BD criado (group_id) > rever melhor mais tarde
- [ ] Adicionar Policies na parte do servidor


------

# Logica de Calendario
- [ ] Versao do calendario
  - comeca em **"0.0"** e quando e publicado incrementa _**"0.1"**_
  - se o calendario passar a definitivo, entao fica **"1.0"**
  - caso exista alguma alteracao apos o estado definitivo, entao incrementa _**"1.0"**_ por cada vez que e publicado outro estado definitivo
  - [X] Logica Server
  - [ ] Logica Client
  - [ ] Testar


- [ ] Publicar o calendario
    - apenas o Coordenador de curso (CC) ou GOP/Direcao e que podem publicar
    - Sempre que o CC publicar:
      - a **_flag_** "**temporary**" passa a "1", e a **_flag_** "**published [9]**" a "0"
        - Comment > para garantir que o calendario fica com as flags corretas 
      - o campo _calendar_phase_id_ passa a "**published [9]**"
      - apos "publicado" cria uma copia automaticamente, devolvendo o novo "id" e fazendo redirect no browser
        - o campo _calendar_phase_id_ passa a "**published [9]**"
    - Sempre que o GOP?/Direcao publicar, a **_flag_** "**temporary**" passa a "0", e a **_flag_** "**published [9]**" a "1" e o campo _calendar_phase_id_ passa a "**published [9]**"
  - [X] Logica Server
  - [ ] Logica Client
  - [ ] Testar


- [ ] Clone/copia do calendario
  - apenas o Coordenador de curso (CC) ou GOP e que podem criar uma copia
  - Quando a copia e criada, as **_flags_** "**temporary**" e "**published [9]**" a "0", e o campo _calendar_phase_id_ passa a:
    - "**In Edit (Course Coordinator) [2]**" caso seja o CC
    - "**In Edit (GOP) [1]**" caso seja o GOP
  - Sera criado um clone de:
    - Calendario
    - Avaliacoes
    - Interrupcoes
    - _Comentarios_
      - sera preciso copiar? Se sim, todos ou apenas os que nao estao escondidos?
  - adicionar no campo **_versao_** mais **"0.1"** caso ainda nao esteja definitivo ou **"1.0"** caso esteja
  - [X] Logica Server
  - [ ] Logica Client
  - [ ] Testar


### TODO Miguel
- [ ] Limpeza "Requests Folder"

---

# Done
- [X] No curso, qdo pede para rever cenas tipo Coordenador:
    - [X]  Dps de preencheres e gravar n atualiza para tirar o erro
    - [X]  E mantem o triangulo a dizer q faltam coisas na listagem
- [X] Mostrar um alerta quando estiver acima de 100% (métodos) para confirmar que quer submeter com mais de 100%;
- [X] Guardar nos métodos nem sempre funciona;
- [X] Rever Tabs dos Cursos
    - [X] Erros na utilização
- [X] Falta testar a pesquisa do coordenador de curso no detalhe do curso
- [X] Rever Tabs dos Cursos
    - Comentei botao de adicionar unidades curriculares, talvez trabalho futuro
- [X] Mensagem de erro no detalhe do curso com infos que faltam
- [X] Faltam traduções e validar se há mais mensagens a aparecer
- [X] Refeita tab dos ramos para usar a tabela
- [X] Para adicionar mantém-se a modal?
- [X] Atualizadas as permissões do lado da BD e do React
- [X] Falta testar. O seeder das permissões agora está mal porque os id's mudaram... Devia ser refeito para quando formos testar isto melhor por user na VM


- **(feito a 2-6-2022)**
  - [X] Lista Calendario
      - [X] Filtros so se houver calendarios noutros semestres ou no semestre atual
      - [X] Botao disabled se nao houver anos-letivos
  - [X] Ano-letivo
      - [X] Botao selected, corrigir o disable
      - [X] Refresh da pagina apos selecionar "selecionado" para atualizar o ano letivo escolhido


- **(feito a 17-6-2022)**
  - **Criação do calendário**
    - [X] Dia seguinte na validação das datas na criação do calendário
    - [X] Voltar a colocar inputs de start e end date em vez dos Range Picker

- **(feito a 04-07-2022)**
- [X] Rever textos de ajuda na sincronização dos anos letivos
- [X] Quando se cria 2 calendários em simultâneo, ele criou na BD, mas na lista não está a mostrar os 2 calendários.
- [X] Quando um calendário ainda não tem dados nenhuns, a coluna da revisão não está a dar a informação correta. 
  - [X] Diz que está tudo preenchido.
  - [X] E o Popup aparece vazio
- [X] Ao criar métodos, deve permitir guardar metodos com peso de 0%, uma vez que podemos querer marcar a data mas não ser um momento de avaliação
- [X] Na criação dos calendários, é necessário adicionar espaços entre as colunas
- [X] Filtrar lista de calendários por provisório/definitivo;
- [X] Publicar calendario (nao funciona?)



--- 

# Meetings log

---
## 2022-05-16
- [X] Nos cursos, UCs que não estão em tronco comum não aparecem (falta confirmar se foram carregadas na BD)
---
## 2022-05-29
- [X] Rever sync/refresh ano letivo
- [X] Rever falta de warning das configs da escola, quando as opções não estão todas preenchidas
---
## Perguntas - 2022-05-17
- [X] ao criar o calendario, adicionar campo para a 10 semana
    - so o gop
- [X] detalhe calendario
    - quando for para seguir para a proxima fase, mostrar popup com fases

----
## Feedback prof. Pedro Gago
- [X] No separador de "Calendários" (GOP) deve haver filtros

- [X] Na definição de métodos de avaliação falta uma opção que permita copiar entre épocas (é habitual a avaliação em exame ter os mesmos elementos tanto em recurso como em especial/mensal)
    - [X] FE
    - [X] BE
    - [X] Na definição de métodos de avaliação devia ir gravando o que se vai fazendo (está a obrigar a preencher tudo de uma vez)
- [X] É provavelmente melhor retirar a opção de criação de calendário para todos os cursos (são cursos a mais)
- [X] Na criação de Novo Calendário, se se escolher apenas a opção de avançar,
    - [X] pede "Tem de selecionar as interrupcoes mandatorias pelo menos!" - mudar para obrigatórias e/ou
    - [X] dizer quais
- [X] Tirar Inglês Geral, Matemáticas Gerais, etc
- [X] Quando tento marcar uma avaliação (1º semestre - 9119) fica "a pensar" à procura de UC

---
## Feedback reunião 2022-05-24
- [X] Marcar avaliações:
    - [X] Verificar se os métodos estão preenchidos
    - [X] Se não estiverem apresentar mensagem de erro e link para as Unidades Curriculares do curso
    - [X] Adicionar icone (check) nos métodos que já estão marcados
    - [X] Adicionar start e end date para avaliações (que se prolongam durante a semana, por exemplo)
    - [X] Retirar outras validações que limitem a plataforma
- [ ] Nas UCs agrupadas, os Coordenadores de Curso podem marcar grupos apenas para as UCs dos seus cursos (ex: EI PL e D)

---
## Reunião 2022-05-31
**Notas Távora**
- [X] Validações da 10a semana
- [X] validações datas época periódica, normal e Recurso, tem de ser superior às outras e ao ano letivo
- [X] Adicional + filtros na criação de calendário para selecionar o curso
- [X] Bug no detalhe da avaliação - observações não está a guardar
- [X] Adicionar descrição dos métodos de avaliação
  - [X] Atualizar no calendario a label
- [X] Automatizar criação da descrição dos métodos ao selecionar o tipo de avaliação
- [X] BUG - Ao duplicar métodos, no FE ele limpa, mas não adiciona à lista de elementos a eliminar, e ao gravar mostra os elementos de avaliação antigos
- [X] Botão Duplicar sticky nos métodos
- [X] Diferenciar quando é feito em aula ou nao (checkbox ou hora)
  - [X] cor diferente se for aula
- [X] Marcar mais do que uma prova no mesmo dia
- [X] Descrição da avaliação
- [X] Melhorar diferença visual das épocas
- [X] validar datas fora de época selecionada (ao marcar avaliações)
  - [X] Esta a validar do calendario, mas pode ser adicionado validacao por epoca
- [ ] Ao eliminar avaliações contínuas, só apaga o dia a apagar
- [X] tipos de avaliações
    - [X] Projetos e trabalhos
        - obrigatório data de lançamento dos enunciados
- [X] ir buscar os dados da sigla e nome inglês do novo webservice - QUANDO FOR CRIADO

---
## Reunião 2022-06-07
**Notas Pedro**
- [X] Validação das épocas não está bem:
  - [X] Deu para criar uma época de recurso no meio da época periódica
- [X] Issue do sticky na tab dos métodos que não renderiza bem até fazer scroll (já sabíamos)
- [X] Ao alterar uma data de uma avaliação, obriga a fazer refresh. Falta atualizar os dados no calendário (já sabíamos)
- [X] Devíamos adicionar uma notificação caso alguma avaliação dure mais do que 1 semana.


- [X] arranjar um webservice que disponibilize os dados das avaliações para outro grupo usar? **Pedido pelo Teams**
  - Penso que não haverá problema em ser pública (os calendários são públicos). A ser necessária, a parte da autenticação poderá ficar em trabalho futuro.
  - Só me parece necessário ter, para cada avaliação: UC, Tipo de Avaliação, Data. Se for possível, juntar o peso na nota final e o mínimo, caso exista.
  - Só português (nesta fase é só para eles poderem ligar datas de avaliação a possível abandono escolar)

**Notas Távora**
- não testou.
- [X] WebService já foi atualizado com Siglas das UCs e deve estar quase a ter também as UCs traduzidas
- [X] Não deve ser possível copiar da época periódica para as outras épocas (querem mesmo limitar pq agr qdo há as fichas das FUC tb têm de introduzir pelo menos duas épocas)
    - Feito mas esta "hardcoded"
- [ ] Deve permitir desfasar os anos. Eventualmente com uma checkbox quando criamos um calendário
    - **Trabalho Futuro?**
---
## Reunião 14/06/2022

- [X] Verificar regulamento para regras das datas;
  - Não havia nada de importante em relação às datas. Apenas as precedências de cada época

**Metodos**
- [X] Voltar a deixar duplicar entre todas as épocas;
- [X] Adicionar validação campo a campo (não saber inputs com erro)
- [X] "Tipo de curso" em vez de “grau de ensino"
- [X] Adicionar warning na tab professores quando responsável não está selecionado
- [X] Trocar ordem das tabs "métodos e professores
- [X] Definir números dos métodos de acordo com o tipo
- [X] "Época de origem" e "época de destino" em vez de “de" e "para"
- [X] No duplicar trocar os dropdowns para checkboxes.
- [X] Falta Acrescente métodos automáticos do projeto

**Detalhe avaliacao - Calendário**
- [X] Nos métodos não está a funcionar bem. (label na drodpwon não está correta)
  - [X] Erro na API não devolve a description
- [X] "Remover Avaliação" e "Alterar Data"
- [X] "Elemento de avaliação" em vez de "método"

**Criação do calendário**
- [X] Dia seguinte na validação das datas na criação do calendário
- [X] Voltar a colocar inputs de start e end date em vez dos Range Picker
- [X] Adicionar “voltar” na criação do calendario

**Detalhe calendário**
- [X] Adicionar “voltar” no detalhe na calendario
- [X] Adicionar flag para fases de calendários que precisam de ter os métodos todos marcados.
- [X] Quando se marca dois métodos no mesmo dia está a substituir ?!
- [ ] Adicionar avisos quando marcamos 2 vezes a mesma avaliação
- [X] Se tiver uma UC com métodos, validar se todos os métodos da UC estão calendarizados.
- [X] Adicionar validações que faltam preencher UCs no calendário.
- [X] Adicionar aviso visual que falta marcar Uc's

- [X] atualizar campos da escola no detalhe

---
## Reunião 21/06/2022
- [X] Calendário provisório
- [X] Cada utilizador pode ter vários roles
- [ ] Guardar histórico dos calendários
- [X] Só GOP / Direção / Coordenador podem publicar calendários
- [X] Destacar mais a revisão

## Reunião 28/06/2022
Melhorias:
- [X] Filtrar lista de calendários por provisório/definitivo;
- [X] Melhorar apresentação dos métodos associados a Projeto
  - [X] Remover Peso e Minimos do Lançamento de Enunciado e Apresentação Oral
  - [X] Bloquear a dropdown para não poder ser alterada
  - [X] Deixar submeter caso algum metodo esteja a 0
- [X] Publicar um calendário
  - [X] Só CC, GOP ou Direção é que pode publicar
    - [1/2] Se for o CC, é uma publicação provisória, e cria automaticamente um clone do calendário para continuar a editar e receber feedback
    - [X] Se for o GOP Publica como definitivo e não cria copia
  - [ ] A direção e o Conselho Pedagógico deve ver apenas botões para Aprovar ou Rejeitar
    - [ ] Se rejeitarem devem poder adicionar um comentário/parecer
  - [X] Alterar popup de submissao


## Reunião 05/07/2022
- [X] Rever date pickers da criação dos calendários:
  - [X] Data de inicio da época normal tem de ser no minimo a data de inicio da época periódica
  - [X] Data final da época normal tem de ser no minimo a data final da época periódica (ou a data inicial da epoca normal +1)
  - [X] Fazer disable/enable dos campos à medida que vamos preenchendo as datas por época
  - [ ] Garantir que as validações também acontecem do lado do servidor, evitando criações de calendário inválidos
- [X] Rever possível bug na dropdown dos anos letivos quando existe mais do que um ano letivo selecionado
  - [X] Adicionar algo (bold ou icon) a mostrar o ano letivo que esta selecionado no dropdown
- [ ] Adicionar ação para "selecionar/deselecionar todos" no popup de submissão, para quem pode ver o calendário
- [ ] Botões de "Aceitar/Aceitar com alterações/Rejeitar" para Conselho Pedagógico ou Direção
- [X] Rever o relatório e a ordem dos vários capítulos

- [X] Erro do "includes of undefined" quando abrimos o calendário
- [1/2] Melhorar página de "No permissions"
- [X] Erro ao gravar um calendário, este não fica visivel na listagem de calendários, porque não estava a associar os grupos que tinham permissão para ver
- [X] Remover link dos cursos se nao estiver sincronizado ainda
  - [X] Na pagina dos ano letivos
  - [X] Corrigir texto que estava trocado

## Issues found while writing report
- [ ] Rever página de Sobre para acrescentar Grupo 1 e adicionar links externos no footer
- [ ] Rever criação de nova UC. link não está a funcionar como deve ser

---

# TRABALHO FUTURO:
- [X] ~~Adicionar flag em cursos como Inglês e Matemática para remover da listagem (não são cursos);~~ **(Feito a ~~26/05/2022)**
- [ ] ~~Adicionar flag nos cursos para saber quais estão em Inglês e devem ser sempre apresentados em Inglês;~~
- [ ] ~~Users com mais do que um role (validar o que deve ser feito)~~
- [ ] ~~Log dos métodos: registar o que foi alterado e quem alterou;~~
- [ ] ~~Notificacoes de quando muda de fase ou adicionam  comentarios no calendario~~
    - [ ] Notificacoes Web
    - [ ] Notificacoes Email
- [ ] subtipos de avaliação **(Reunião 31/05/2022)**
    - poder adicionar subtipos na pagina de tipos de avaliacoes e depois quando se adicionar o metodo de avaliacao,
      estes sao automaticamente preenchidos, podendo ter o campo de obrigatoriedade ou nao.
- [ ] Anos curriculares desfasados por ano no Calendários - **(Reunião 31/05/2022)**
  - ex: o 1 ano pode comecar numa data diferente da do 2 e/ou 3 ano
  - trabalho futuro
  
    - **_talvez trabalho futuro?_** Usar Redis e WebSockets
- [ ] Melhorar accessibilidades pelo site (WCAG checklist) - especialmente cores e navegação com o keyboard
- [ ] Deve permitir desfasar os anos. Eventualmente com uma checkbox quando criamos um calendário - **(Reunião 2022-06-07)**
- [ ] Adicionar alertas de sistema para relembrar publicação do calendário provisório e definitivo (Artigo 21) **Ideia Alexandre**
  - [ ] Provisório - até 1º dia de aulas
  - [ ] Definitivo - até 5a semana de aulas
