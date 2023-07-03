# juBUYrte
Olá! Esse é o nosso repositório do projeto final Alura NxtDev3. Nesse ReadMe você encontrará instruções para inicializar o ambiente de desenvolvimento, assim como detalhes do que o projeto soluciona. Qualquer dúvida entre em contato com a equipe **Jubarte** 🐳 que ficaremos felizes em responder.


### Orientações
<details>
  <summary><strong>✨ Inicializando o Ambiente </strong></summary><br />

Para inicializar o container, escreva o seguinte comando em seu terminal: `docker-compose up`. Entre na pasta que você deseja desenvolver e instale as depêndencias com `npm install`. Para que o projeto inicie basta utilizar o comando `npm start` e para que o ambiente seja atualizado a cada mudança no código, basta utilizar `npm run dev`.
</details>
<details>
<summary><strong>✨ Portas dos Microsserviços </strong></summary><br />

Cada microsserviço tem sua própria porta:

| Microsserviço | Porta |
| ----------- | ----------- |
| Clientes   | 3001       |
| Transações   | 3002        |
| Anti-Fraude   | 3003        |

</details>
<details>
<summary><strong>✨ Testes da Aplicação </strong></summary><br />

Os testes desse projeto foram feitos utilizando o [JEST](https://jestjs.io/pt-BR/). Para rodar os testes basta utilizar o comando `npm test`.

</details>

<br><br>

## Clientes
É necessário **criar um usuário** para interagir com as possibilidades do nosso projeto. Tendo um usuário é possível **criar uma conta** onde não há necessidade de se preocupar com a segurança da senha pois utilizamos a biblioteca `bcrypt` para garantir a criptografia desse dado sensível. Ao fazer login o usuário tem os privilégios de **buscar contas, buscar contas por ID específico, atualizar contas e deletar contas**. 

Esses privilégios só duram enquanto o usuário possuir um token de autenticação ativo, que foi implementado com a lib `passport`.

Também é possível **buscar todos os usuários, buscar usuários por ID específico e deletar usuários**.

Nos asseguramos de garantir dados válidos e confiáveis dos cartões de crédito nas contas de nossos usuários. Nosso projeto faz a **validação dos dados** e da **renda** que o usuário possui, facilitando os microsserviços de Transações e Antifraude.

Os dados do cartão foram criptografados para garantir a segurança dos clientes. Utilizamos a biblioteca `ncryptJS`.

✨ Esse microsserviço tem testes para cobrir 100% das funções.

<br>

## Transações
O usuário utiliza o fluxo de criar uma transação onde são enviados os dados do cartão junto com o valor da transação para serem verificados no microsserviço de Clientes. Após verificar a validação desses dados, caso a renda do usuário seja maior ou igual à 50% da renda do cliente, essa transação precisará ser analisada pelo microsserviço de Antifraude e estará 'Em análise', caso o contrário a transação receberá o status 'Aprovada' ou 'Rejeitada'.

## AntiFraude
Agindo como um complemento de segurança ao fluxo de Transações, o microsserviço de Antifraude traz uma forma de capturar transações que não são óbvias de serem naturais e enviar para uma análise humana, resultando em uma aprovação ou rejeição. 

Aqui, o foco é garantir que as análises serão corretamente aprovadas ou rejeitadas.

✨ Esse microsserviço tem testes para cobrir 100% das funções.

## Api-Gateway
O porteiro das nossas requisições gerencia as várias APIs e microsserviços que nosso projeto possui além de estabelecer um limite na quantidade de requisições que podem ser feitas em determinado período de tempo. Construído utilizando `nginx´.

Inicialmente começamos com a taxa de duas requisições por minuto, mas por ser uma taxa extremamente agressiva optamos por manter em trinta requisições por minuto.

<br><br>
### Créditos
<em>Feito com carinho por Alison, Taynara, Vitor, Lauro, Ana Carolina, Filipe e Samuel.</em>
