const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Rota para o CRUD de livros
const livrosRouter = require('./routes/livros');
app.use('/livros', livrosRouter);

// Rota para os empréstimos e devoluções
const emprestimosRouter = require('./routes/emprestimos');
app.use('/emprestimos', emprestimosRouter);

app.get('/', (req, res) => {
    res.send('API da Biblioteca Digital - Bem-vindo!');
});

// Retornos de erro padrões
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        erro: "Ocorreu um erro interno no servidor.",
        codigo: 500,
        timestamp: new Date().toISOString()
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        erro: "Recurso não encontrado.",
        codigo: 404,
        timestamp: new Date().toISOString(),
        caminho: req.path
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ligado, localhost:${PORT}`);
});