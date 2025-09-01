// Emulando um banco de dados em tempo de execução. Poderia ser substituído pelo H2 Database por exemplo
let autores = [
    { id: 1, nome: "Robert C. Martin", biografia: "Autor de Clean Code." },
    { id: 2, nome: "Martin Fowler", biografia: "Autor de Refactoring." }
];

let livros = [
    { id: 1, titulo: "Clean Architecture", isbn: "978-0134494166", ano_publicacao: 2017, disponivel: true, autor_id: 1 },
    { id: 2, titulo: "Refactoring", isbn: "978-0201485677", ano_publicacao: 1999, disponivel: false, autor_id: 2 },
    { id: 3, titulo: "Clean Code", isbn: "978-0132350884", ano_publicacao: 2008, disponivel: true, autor_id: 1 }
];

let usuarios = [
    { id: 101, nome: "Ana Souza", email: "ana.souza@example.com" },
    { id: 102, nome: "Carlos Pereira", email: "carlos.pereira@example.com" }
];

let emprestimos = [
    { id: 501, livro_id: 2, usuario_id: 101, data_emprestimo: "2025-08-25T10:00:00Z", data_devolucao: null }
];


module.exports = { autores, livros, usuarios, emprestimos };