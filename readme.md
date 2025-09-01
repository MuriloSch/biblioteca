# API de Gerenciamento de Biblioteca Digital

API Restful desenvolvida para gerenciamento de livros, autores e empréstimos de uma biblioteca.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework para construção da API.

## Instalação e Execução

**Requisitos:**
- Node.js (v14 ou superior)
- npm

**Passos:**
1. Clone o repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd biblioteca-api
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm start
   ```
4. A API estará disponível em `http://localhost:3000`.

## [cite_start]Documentação da API

A seguir estão descritos os endpoints disponíveis para o recurso **Livros**.

### **GET /livros**
Lista todos os livros.
- **Query Params (opcionais):**
  - `autor_id={id}`: Filtra por ID do autor.
  - `disponivel={true|false}`: Filtra por disponibilidade.
  - `sort=titulo`: Ordena pelo título.
  - `order={asc|desc}`: Define a ordem da ordenação.
  - `page={numero}`: Define a página para paginação.
  - `size={numero}`: Define o tamanho da página.
- [cite_start]**Resposta de Sucesso (200 OK):** 
  ```json
  [
    {
      "id": 1,
      "titulo": "Clean Architecture",
      "disponivel": true,
      "autor": { "id": 1, "nome": "Robert C. Martin" },
      "_links": [ /* ... */ ]
    }
  ]
  ```

### **GET /livros/{id}**
Busca um livro específico pelo ID.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "id": 1,
    "titulo": "Clean Architecture",
    /* ... */
  }
  ```
- [cite_start]**Resposta de Erro (404 Not Found):**
  ```json
  {
    "erro": "Livro não encontrado",
    "codigo": 404,
    "timestamp": "...",
    "caminho": "/livros/999"
  }
  ```

### **POST /livros**
Cria um novo livro.
- **Corpo da Requisição:**
  ```json
  {
    "titulo": "Novo Livro",
    "isbn": "123-4567890123",
    "ano_publicacao": 2025,
    "autor_id": 1
  }
  ```
- **Resposta de Sucesso (201 Created):** Retorna o objeto do livro criado com links HATEOAS.

### **PUT /livros/{id}**
Atualiza um livro existente.
- **Corpo da Requisição:**
  ```json
  {
    "titulo": "Título Atualizado",
    "isbn": "123-4567890123",
    "ano_publicacao": 2025,
    "autor_id": 1,
    "disponivel": false
  }
  ```
- **Resposta de Sucesso (200 OK):** Retorna o objeto do livro atualizado.

### **DELETE /livros/{id}**
Remove um livro.
- **Resposta de Sucesso (204 No Content):** Nenhum corpo na resposta.

### [cite_start]Utilizando HATEOAS
As respostas para os endpoints de livros incluem um campo `_links`. Esse campo contém uma lista de ações possíveis para o recurso, como buscar, atualizar ou deletar. Clientes da API devem usar esses links para navegar pela aplicação, em vez de montar as URIs manualmente.