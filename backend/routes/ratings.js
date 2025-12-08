const express = require("express");
const router = express.Router();

// RF5: Avaliações de filmes
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Rota para criar uma avaliação
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { movie_id, score, comentario } = req.body;
    const user_id = req.user.id;

    // Validação básica
    if (!movie_id || !score || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: 'Dados inválidos' });
    }

    // Verifica se já existe avaliação do usuário para o filme
    const existing = await db.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND movie_id = $2',
      [user_id, movie_id]
    );

    if (existing.rows.length > 0) {
      // Erro para evitar duplicação 
      return res.status(400).json({ success: false, message: 'Avaliação já existe' });
    } else {
      // Cria nova avaliação
      await db.query(
        'INSERT INTO ratings (user_id, movie_id, score, rating_date) VALUES ($1, $2, $3, NOW())',
        [user_id, movie_id, score]
      );
      return res.status(201).json({ success: true, message: 'Avaliação criada' });
    }
  } catch (error) {
    console.error('Erro ao criaravaliação:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Rota para obter avaliações de um filme específico
router.get('/movie/:id', authenticateToken, async (req, res) => {
  try {
    const movie_id = req.params.id;
    const result = await db.query(
      'SELECT r.id, r.user_id, u.name AS user_name, r.score, r.rating_date FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.movie_id = $1 ORDER BY r.rating_date DESC',
      [movie_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao obter avaliações:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Rota para obter avaliações feitas por um usuário específico
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const user_id = req.params.id;
    const result = await db.query(
      'SELECT r.id, r.movie_id, m.title AS movie_title, r.score, r.rating_date FROM ratings r JOIN movies m ON r.movie_id = m.id WHERE r.user_id = $1 ORDER BY r.rating_date DESC',
      [user_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao obter avaliações:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Rota para atualizar uma avaliação
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const rating_id = req.params.id;
    const { score, comentario } = req.body;
    const user_id = req.user.id;

    // Verifica se a avaliação pertence ao usuário
    const existing = await db.query(
      'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
      [rating_id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Avaliação não encontrada' });
    }
    // Atualiza a avaliação
    await db.query(
      'UPDATE ratings SET score = $1, rating_date = NOW() WHERE id = $2',
      [score || null, rating_id]
    );
    return res.json({ success: true, message: 'Avaliação atualizada' });
  }
  catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Rota para deletar uma avaliação
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const rating_id = req.params.id;
    const user_id = req.user.id;

    // Verifica se a avaliação pertence ao usuário
    const existing = await db.query(
      'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
      [rating_id, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Avaliação não encontrada' });
    }

    // Deleta a avaliação
    await db.query(
      'DELETE FROM ratings WHERE id = $1',
      [rating_id]
    );
    return res.json({ success: true, message: 'Avaliação deletada' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});


module.exports = router;
