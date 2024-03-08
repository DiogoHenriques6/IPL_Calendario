
Para testar a aplicação aceder a:
http://178.62.27.213/			-> http://172.22.21.74/

Em caso de dúvida, contactar:

Grupo 1:
	2171193@my.ipleiria.pt - Bruno Manuel dos Reis Pereira
	2151564@my.ipleiria.pt - Tiago Gilberto Ribeiro Lourenço

Grupo 2:
	2171636 - Rafael Ferreira
	2161349 - Francisco Fernandes


Dados de autenticação disponíveis:

Utilizadores:

	1. Administrador de Sistema

	    - administrador@ipleiria.pt

	2. Direção

	    - direcao1@ipleiria.pt
	    - direcao2@ipleiria.pt
	    - direcao3@ipleiria.pt

	3. GOP

	    - gop1@ipleiria.pt
	    - gop2@ipleiria.pt
	    - gop3@ipleiria.pt

	4. Coordenador de Curso

	    - cc1@ipleiria.pt
	    - cc2@ipleiria.pt
	    - cc3@ipleiria.pt

	5. Responsável Unidade Curricular

	    - ruc1@ipleiria.pt
	    - ruc2@ipleiria.pt
	    - ruc3@ipleiria.pt

	6. Responsável Conselho Pedagógico

	    - rcp1@ipleiria.pt
	    - rcp2@ipleiria.pt
	    - rcp3@ipleiria.pt

	7. Conselho Pedagógico

	    - cp1@ipleiria.pt
	    - cp2@ipleiria.pt
	    - cp3@ipleiria.pt

	8. Professor

	    - professor1@ipleiria.pt
	    - professor2@ipleiria.pt
	    - professor3@ipleiria.pt

	9. Comissão Científico-Pedagógica

	    - ccp@ipleiria.pt

	10. Aluno

	    - aluno1@ipleiria.pt
	    - aluno2@ipleiria.pt
	    - aluno3@ipleiria.pt


Password: para todos os Utilizadores a password é "password"

---------------------------------------------------------------

Para proceder a uma instalação limpa num servidor local, executar os seguintes
comandos pela mesma ordem que são apresentados:

	php artisan migrate:fresh

	composer dump-autoload
	composer update
	npm install
	php artisan db:seed --class=DatabaseSeederEntrega

	php artisan passport:install

	- Atualizar o ID no ficheiro .env

	php artisan cache:clear
	php artisan config:clear

	1. Criar Fases Calendário

	   1. Criado - Created
	   2. Em edição (GOP) - In editing (GOP)
	   3. Em edição (Coordenador de Curso) - In editing (Course coordinator)
	   4. Em edição (Responsável UC) - In editing (Responsible UC)
	   5. Em avaliação (CCP)
	   6. Em avaliação (Conselho Pedagógico)
	   7. Em avaliação (GOP)
	   8. Em avaliação (Direção)
	   9. Em avaliação (Alunos)
	   10. Aprovado
	   11. Publicado

	   
	2. Criar Interrupções

		1. Natal (Christmas)
	    2. Páscoa (Easter)
	    3. Feriado (Holiday)
	    4. Desfile do caloiro (Freshman parade)
		5. Abertura solene (Solemn opening)
		6. Desfile académico (Academic parade)
		7. Semana académica (Academic week)
		8. Dia aberto (Open day)
		9. Carnaval (Carnival)


	3. Criar Tipos de Avaliação

		1. Prova escrita (Written test)
		2. Prova oral (Oral test)
		3. Teste prático (Practice test)
		4. Relatório ou trabalho escrito (Report or written work)
		5. Apresentação oral pública (Public oral presentation)
		6. Protótipo (Prototype)
		7. Trabalho laboratorial (Laboratory work)
		8. Projeto (Project)
		9. Estágios ou projetos externos (External internships or projects)
		10. Portfolios (Portfolios)


	4. Criar Grupos de Utilizador

		1. Administrador de Sistema 		
		2. Direção 							
		3. GOP 								
		4. Coordenador de Curso 			
		5. Responsável Unidade Curricular 	
		6. Responsável Conselho Pedagógico	
		7. Conselho Pedagógico  			
		8. Professor 						
		9. Comissão Científico-Pedagógica 	
		10. Aluno 		


	5. Associar os Utilizadores aos Grupos de Utilizador criados

		1. Administrador de Sistema
			- administrador@ipleiria.pt
		2. Direção
			- direcao1@ipleiria.pt
			- direcao2@ipleiria.pt
			- direcao3@ipleiria.pt

		3. GOP			
			- gop1ipleiria.pt
			- gop2@ipleiria.pt
			- gop3@ipleiria.pt

		4. Coordenador de Curso	
			- cc1@ipleiria.pt
			- cc2@ipleiria.pt
			- cc3@ipleiria.pt

		5. Responsável Unidade Curricular
			- ruc1@ipleiria.pt
			- ruc2@ipleiria.pt
			- ruc3@ipleiria.pt

		6. Responsável Conselho Pedagógico
			- rcp1@ipleiria.pt
			- rcp2@ipleiria.pt
			- rcp3@ipleiria.pt

		7. Conselho Pedagógico
			- cp1@ipleiria.pt
			- cp2@ipleiria.pt
			- cp3@ipleiria.pt

		8. Professor 						
			- professor1@ipleiria.pt
			- professor2@ipleiria.pt
			- professor3@ipleiria.pt

		9. Comissão Científico-Pedagógica 	
			- ccp@ipleiria.pt

		10. Aluno 							
			- aluno1@ipleiria.pt
			- aluno2@ipleiria.pt
			- aluno3@ipleiria.pt