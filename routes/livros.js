const express = require('express');
const router = express.Router();
let { livros, autores, emprestimos } = require('../database');

// Função para adicionar links HATEOAS
const addHateoasLinks = (livro) => {
    const livroComLinks = {
        ...livro,
        _links: [
            { rel: "self", href: `/livros/${livro.id}`, method: "GET" },
            { rel: "update", href: `/livros/${livro.id}`, method: "PUT" },
            { rel: "delete", href: `/livros/${livro.id}`, method: "DELETE" }
        ]
    };

    if (livro.disponivel) { //Rota de empréstimos
        livroComLinks._links.push({
            rel: "emprestar",
            href: `/emprestimos`,
            method: "POST"
        });
    } else {
        const emprestimoAtivo = emprestimos.find(e => e.livro_id === livro.id && e.data_devolucao === null);
        if (emprestimoAtivo) { //Rota de devolução de empréstimos
            livroComLinks._links.push({
                rel: "devolver",
                href: `/emprestimos/${emprestimoAtivo.id}/devolucao`,
                method: "PUT"
            });
        }
    }
    return livroComLinks;
}


// GET /livros - Rota para listagem de todos os livros
router.get('/', (req, res) => {
    let livrosFiltrados = [...livros];

    // Query Parameters: Filtragem
    if (req.query.autor_id) {
        livrosFiltrados = livrosFiltrados.filter(l => l.autor_id == req.query.autor_id);
    }
    if (req.query.disponivel) {
        const disponivel = req.query.disponivel === 'true';
        livrosFiltrados = livrosFiltrados.filter(l => l.disponivel === disponivel);
    }

    // Ordenação
    if (req.query.sort === 'titulo') {
        livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo) * (req.query.order === 'desc' ? -1 : 1));
    }
    
    // Paginação
    const page = parseInt(req.query.page, 10) || 1;
    const size = parseInt(req.query.size, 10) || 10;
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    const paginatedLivros = livrosFiltrados.slice(startIndex, endIndex);

    // Adiciona autor e links HATEOAS
    const resultado = paginatedLivros.map(livro => {
        const autor = autores.find(a => a.id === livro.autor_id);
        const livroComAutor = { ...livro, autor: { id: autor.id, nome: autor.nome } };
        delete livroComAutor.autor_id;
        return addHateoasLinks(livroComAutor);
    });

    res.status(200).json(resultado);
});

// GET /livros/ - Rota para consulta de livros através do ID
router.get('/:id', (req, res) => {
    const livro = livros.find(l => l.id == req.params.id);
    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado", codigo: 404, timestamp: new Date().toISOString(), caminho: `/livros/${req.params.id}` });
    }
    const autor = autores.find(a => a.id === livro.autor_id);
    const livroComAutor = { ...livro, autor: { id: autor.id, nome: autor.nome } };
    delete livroComAutor.autor_id;
    
    res.status(200).json(addHateoasLinks(livroComAutor));
});

// POST /livros - Rota para criação de um novo livro 
router.post('/', (req, res) => {
    const { titulo, isbn, ano_publicacao, autor_id } = req.body;
    if (!titulo || !isbn || !autor_id) { // Validação se título, ISBN e autor estão em branco
        return res.status(400).json({ erro: "Título, ISBN e autor_id são obrigatórios." });
    }
    const autorExiste = autores.find(a => a.id === autor_id);
    if (!autorExiste) { // Validação se o autor está registrado 
        return res.status(404).json({ erro: "Autor não encontrado." });
    }
    const novoLivro = { // Criação do livro
        id: livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1,
        titulo,
        isbn,
        ano_publicacao,
        disponivel: true,
        autor_id
    };
    livros.push(novoLivro);

    const autor = autores.find(a => a.id === novoLivro.autor_id);
    const livroComAutor = { ...novoLivro, autor: { id: autor.id, nome: autor.nome } };
    delete livroComAutor.autor_id;
    
    res.status(201).json(addHateoasLinks(livroComAutor));
});

// PUT /livros/ - Rota para atualização de um livro (pelo ID)
router.put('/:id', (req, res) => {
    const { titulo, isbn, ano_publicacao, autor_id, disponivel } = req.body;
    const index = livros.findIndex(l => l.id == req.params.id);

    if (index === -1) { // Validação se o ID existe
        return res.status(404).json({ erro: "Livro não encontrado" });
    }
    if (!titulo || !isbn || !autor_id || typeof disponivel !== 'boolean') { // Validação se os campos estão devidamente preenchidos
        return res.status(400).json({ erro: "Todos os campos (titulo, isbn, autor_id, disponivel) são obrigatórios." });
    }

    livros[index] = { ...livros[index], titulo, isbn, ano_publicacao, autor_id, disponivel }; // Atualiza registro

    const autor = autores.find(a => a.id === livros[index].autor_id);
    const livroComAutor = { ...livros[index], autor: { id: autor.id, nome: autor.nome } };
    delete livroComAutor.autor_id;

    res.status(200).json(addHateoasLinks(livroComAutor));
});

// DELETE /livros/- Rota para remoção de um livro (pelo ID)
router.delete('/:id', (req, res) => {
    const index = livros.findIndex(l => l.id == req.params.id);
    if (index === -1) { //Valida se o ID existe 
        return res.status(404).json({ erro: "Livro não encontrado" });
    }
    livros.splice(index, 1); //Remove o registro
    return res.status(204).send();
});

module.exports = router;