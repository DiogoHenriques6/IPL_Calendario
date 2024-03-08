
- [ ] Ao criar novo exame, mostra todos as unidades curriculares, ou so as que lhe pertencem? (ex. sou prof de fisica, vejo algebra?)
    - o professor so tem acesso as dele
    - Gop e Coordenador de curso tem acesso as cadeiras do curso



- **CCP** = Comissao Cientfico-Pedagocica
- **RCP** = Responsavel Conselho Pedagócio
- **RUC** = Responsavel Unidade Curricular



## Roles/Permissions test on Front End

| **Roles**<br/>------<br/>**Pages** | Super Admin                | Admin | GOP | CCP | Coordenador de Curso | Responsável de UC | RCP | Conselho Pedagócio | Direção | Docente | Estudante |
|------------------------------------|----------------------------|-------|-----|-----|----------------------|-------------------|-----|--------------------|---------|---------|-----------|
| _**Calendario**_                   |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Adicionar comentario             | ?                          |       |     |     |                      |                   |     |                    |         |         |           |
| - ver comentario                   | ?  e o ocultar?            |       |     |     |                      |                   |     |                    |         |         |           |
| - ver historico                    |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - ver fase atual                   |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - publicar	                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - criar copia	                     |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Adicionar interrupcoes          |                            |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar exame                 |                            |       |     |     |                      |                   |     |                    |         |         |           |
| -> Editar exame                    |                            |       |     |     |                      |                   |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Fases do Calendario**_          |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - criar Fases                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - editar Fases                     |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Apagar Fases                     |                            |       |     |     |                      |                   |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Curso**_                        |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        | ????                       |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |
| - Adicionar Ramos                  | ??????                     |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Unidade Curricular**_           |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Adicionar Metodos                |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Adicionar Professores            | (mesma que as permissoes?) |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
||| <br/>                              ||||||||||
| _**Agrupar Unidade Curricular**_   |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Adicionar Metodos                | ???????                    |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Ano Letivo**_                   |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Tipos De Avaliacao**_           |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Tipos de Interrupcoes**_        |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Escolas**_                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           | ?????                      |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Permissoes**_                   |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Gerir Permissoes                 |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Definir Coordenador Curso        |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Definir RUC*                     |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Definir Professores UCs          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Grupo de Utilizador**_          |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Criar                            |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Apagar                           |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                              ||||||||||||
| _**Utilizadores**_                 |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Ver Lista                        |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Ver Detalhe                      |                            |       |     |     |                      |                   |     |                    |         |         |           |
| - Editar	                          |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - Bloquear                         |                            |       |     |     | 	                    | 	                 |     |                    |         |         |           |

---

## Permissoes do Calendario

| Roles<br/>Fases                          | Super Admin | Admin | GOP | CCP | Coordenador de Curso | Responsável de UC | RCP | Conselho Pedagócio | Direção | Docente | Estudante |
|------------------------------------------|-------------|-------|-----|-----|----------------------|-------------------|-----|--------------------|---------|---------|-----------|
| _**Criado**_                             |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em edição (GOP)**_                    |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em edição (Coordenador de Curso)**_   |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em edição (Responsável UC)**_         |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em avaliação (CCP)**_                 |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em avaliação (Conselho Pedagógico)**_ |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em avaliação (GOP)**_                 |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em avaliação (Direção)**_             |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Em avaliação (Alunos)**_              |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Aprovado**_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**Publicado**_                          |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| <br/>                                    ||||||||||||
| _**System**_                             |             |       |     |     |                      |                   |     |                    |         |         |           |
| - _Calendario_                           |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar Comentarios                 |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Mudar Fase                            |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar avaliacoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar avaliacoes                     |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover avaliacoes                    |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| - _Tipos Avaliacao_                      |             |       |     |     |                      |                   |     |                    |         |         |           |
| -> Adicionar interrupcoes                |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> Editar interrupcoes                   |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |
| -> remover interrupcoes                  |             |       |     |     | 	                    | 	                 |     |                    |         |         |           |


## Fase de um calendario
| Id  | fases                              | Proxima fase                         | obs         |
|-----|------------------------------------|--------------------------------------|-------------|
| 1   | Criado                             | 2                                    |             |
| 2   | Em edição (GOP)                    | 3                // 9                |             |
| 3   | Em edição (Coordenador de Curso)   | 4,5 // 7  > (.)  // 2                |             |
| 4   | Em edição (Responsável UC)         | 3>cc                                 |             |
| 5   | Em avaliação (Alunos)              | 6>cc                                 | so comenta  |
| 6   | Em avaliação (CCP)                 | 3>cc                                 | so comenta  |
| 7   | Em avaliação (GOP)                 | ____// 3,8 > (.) //                  |             |
| 8   | Em avaliação (Conselho Pedagógico) | ____// __________// 2,3 > (.) //     | so comenta  |
| 9   | Em avaliação (Direção)             | ____// __________// __________// 10  |             |
| 10  | Aprovado                           | ____// __________// __________// 11  |             |
| 11  | Publicado                          |                                      |             |


