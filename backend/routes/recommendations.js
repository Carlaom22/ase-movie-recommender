const express = require("express");
const router = express.Router();

const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

/**
 * GET /recommendations/test
 */
router.get("/test", (req, res) => {
  res.json({
    route: "recommendations",
    message: "Recommendations route OK",
  });
});

/**
 * GET /recommendations
 *
 * Devolve recomendações personalizadas para o utilizador autenticado.
 */
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1) Ver géneros preferidos do user (média de score por género)
    const genreQuery = `
      SELECT
        m.genre,
        AVG(r.score)::numeric(3,2) AS avg_score,
        COUNT(*) AS rating_count
      FROM ratings r
      JOIN movies m ON m.id = r.movie_id
      WHERE r.user_id = $1
        AND m.genre IS NOT NULL
      GROUP BY m.genre
      HAVING COUNT(*) >= 1
      ORDER BY avg_score DESC, rating_count DESC
      LIMIT 3;
    `;

    const genreResult = await db.query(genreQuery, [userId]);
    const favoriteGenres = genreResult.rows.map((row) => row.genre);

    let strategy = "popular_fallback";
    let recsResult;

    if (favoriteGenres.length > 0) {
      // 2) Recomendar filmes dos géneros favoritos que o user ainda não avaliou
      strategy = "top_genres";

      const placeholders = favoriteGenres
        .map((_, idx) => `$${idx + 2}`)
        .join(", ");

      const recsQuery = `
        SELECT
          m.id,
          m.title,
          m.year,
          m.genre,
          m.synopsis,
          m.popularity_score,
          COALESCE(AVG(r2.score), 0)::numeric(3,2) AS avg_rating,
          COUNT(r2.id) AS rating_count
        FROM movies m
        LEFT JOIN ratings r2 ON r2.movie_id = m.id
        WHERE m.genre IN (${placeholders})
          AND m.id NOT IN (
            SELECT movie_id FROM ratings WHERE user_id = $1
          )
        GROUP BY m.id
        ORDER BY avg_rating DESC, rating_count DESC, m.popularity_score DESC NULLS LAST, m.id ASC
        LIMIT 10;
      `;

      const values = [userId, ...favoriteGenres];
      recsResult = await db.query(recsQuery, values);
    }

    // 3) Se ainda assim não houver recomendações → fallback global
    if (!recsResult || recsResult.rows.length === 0) {
      strategy = "popular_fallback";

      const fallbackQuery = `
        SELECT
          m.id,
          m.title,
          m.year,
          m.genre,
          m.synopsis,
          m.popularity_score,
          COALESCE(AVG(r2.score), 0)::numeric(3,2) AS avg_rating,
          COUNT(r2.id) AS rating_count
        FROM movies m
        LEFT JOIN ratings r2 ON r2.movie_id = m.id
        WHERE m.id NOT IN (
          SELECT movie_id FROM ratings WHERE user_id = $1
        )
        GROUP BY m.id
        ORDER BY avg_rating DESC, rating_count DESC, m.popularity_score DESC NULLS LAST, m.id ASC
        LIMIT 10;
      `;

      recsResult = await db.query(fallbackQuery, [userId]);
    }

    const items = (recsResult.rows || []).map((row) => ({
      id: row.id,
      title: row.title,
      year: row.year,
      genre: row.genre,
      synopsis: row.synopsis,
      popularity_score: row.popularity_score,
      avg_rating: row.avg_rating !== null ? Number(row.avg_rating) : 0,
      rating_count: Number(row.rating_count) || 0,
    }));

    return res.json({
      success: true,
      data: {
        userId,
        strategy,
        favoriteGenres,
        items,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar recomendações:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao gerar recomendações",
    });
  }
});

module.exports = router;
