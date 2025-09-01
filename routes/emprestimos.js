const express = require('express');
const router = express.Router();
let { livros, usuarios, emprestimos } = require('../database');

// GET /emprestimos - Rota para listagem dos empréstimos
router.get('/', (req, res) => {
    res.status(200).json(emprestimos);
});

// POST /emprestimos - Rota para criar um novo empréstimo
router.post('/', (req, res) => {
    const { livro_id, usuario_id } = req.body;

    if (!livro_id || !usuario_id) { // Valida se o ID do livro e do usuário estão preenchidos
        return res.status(400).json({ erro: "livro_id e usuario_id são obrigatórios" });
    }
    const livro = livros.find(l => l.id === livro_id);
    if (!livro) { // Valida se o livro existe
        return res.status(404).json({ erro: "Livro não encontrado" });
    }
    const usuario = usuarios.find(u => u.id === usuario_id);
    if (!usuario) { // Valida se o usuário existe
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    if (!livro.disponivel) {  // Bloqueio de empréstimos de livros já emprestados
        return res.status(409).json({ erro: "Conflito: Livro já emprestado" }); // 
    }

    const novoEmprestimo = { // Cria o empréstimo
        id: emprestimos.length > 0 ? Math.max(...emprestimos.map(e => e.id)) + 1 : 1,
        livro_id,
        usuario_id,
        data_emprestimo: new Date().toISOString(),
        data_devolucao: null
    };

    livro.disponivel = false; // Altera o estado do livro
    emprestimos.push(novoEmprestimo);

    res.status(201).json(novoEmprestimo);
});

// PUT /emprestimos/:id/devolucao - Rota para devolver um livro
router.put('/:id/devolucao', (req, res) => {
    const emprestimoId = parseInt(req.params.id, 10);
    const emprestimo = emprestimos.find(e => e.id === emprestimoId);

    if (!emprestimo) { // Valida se há empréstimo
        return res.status(404).json({ erro: "Empréstimo não encontrado" });
    }
    if (emprestimo.data_devolucao) { // Valida se ele já foi devolvido
        return res.status(409).json({ erro: "Conflito: Este livro já foi devolvido" });
    }

    const livro = livros.find(l => l.id === emprestimo.livro_id);
    if (livro) {
        livro.disponivel = true;
    }

    // Devolve o livro
    emprestimo.data_devolucao = new Date().toISOString();

    res.status(200).json(emprestimo);
});

module.exports = router;