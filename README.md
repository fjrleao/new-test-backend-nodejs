## Serviço de catalogo de produtos

Esta aplicação tem como objetivo criar uma API para gerenciar um catálogo de produtos. Esse gerenciamento envolve o cadastro de categorias e produtos associados a um proprietário específico, bem como o estabelecimento de relações entre essas categorias e produtos. Após o cadastro das categorias e produtos, a API permite a listagem do catálogo.

Para otimizar o desempenho da API, foi implementada uma solução baseada no AWS SQS em conjunto com o AWS S3. Sempre que um produto é cadastrado ou atualizado, uma mensagem é automaticamente publicada na fila do SQS. Posteriormente, um processo consumidor dessa fila gera um arquivo JSON contendo o catálogo atualizado e o armazena no S3. Esse método permite realizar consultas no catálogo sem a necessidade de efetuar pesquisas frequentes no banco de dados, contribuindo para a eficiência do sistema.

### Executando o projeto

Para executar o projeto é necessário Node.js, MongoDB e ter uma conta na AWS.

1. Comece fazendo o clone deste repositório:

```bash
git clone <repositorio_url>
```

2. Acesse a pasta do repositório e instale as dependências usando o NPM ou o gestor de dependência da sua preferência:

```bash
npm install
```

3. Crie uma cópia do arquivo **.env.example** e renomeie para **.env**.

4. Abra o **.env** e preencha com as variáveis de ambiente.

5. Execute usando o script de dev:

```bash
npm run dev
```

Com tudo feito, o servidor web da API estará executando.

### Documentação das rotas

[Acesse a documentação das rotas.](https://fjrleao.github.io/new-test-backend-nodejs/)

### Tecnologias utilizadas

- [Node.js 18.x](https://nodejs.org/en)
- [Express.js](https://expressjs.com/pt-br/)
- [MongoDB](https://www.mongodb.com/)
- [AWS](https://aws.amazon.com/pt/)
