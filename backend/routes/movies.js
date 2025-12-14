const express = require("express");
const router = express.Router();

const db = require("../db");
const { optionalAuth } = require("../middleware/auth");

/**
 * Helper: converte query param em inteiro positivo com fallback
 */
function parsePositiveInt(value, defaultValue) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return defaultValue;
  return n;
}

/**
 * GET /movies/test
 */
router.get("/test", (req, res) => {
  console.log("[MOVIES] /movies/test chamado");
  res.json({
    route: "movies",
    message: "Movies route OK",
  });
});

/**
 * GET /movies
 * Catálogo de filmes com filtros, ordenação e paginação
 */
router.get("/", optionalAuth, async (req, res) => {
  console.log("\n==============================");
  console.log("[MOVIES] GET /movies chamado");

  const {
    q,
    search,
    genre,
    year,
    year_from,
    year_to,
    sort,
    order,
    page,
    per_page,
  } = req.query;

  // USER INFO (optionally authenticated)
  if (req.user) {
    console.log("[MOVIES] User autenticado:", req.user.email, "(id:", req.user.id + ")");
  } else {
    console.log("[MOVIES] Pedido público (sem token)");
  }

  console.log("[MOVIES] Query params recebidos:", req.query);

  try {
    const searchTerm = (search || q || "").trim();
    const currentPage = parsePositiveInt(page, 1);
    const perPage = parsePositiveInt(per_page, 20);
    const offset = (currentPage - 1) * perPage;

    const values = [];
    const whereClauses = [];

    // LOG filtros
    if (searchTerm) console.log("[MOVIES] Filtro: search =", searchTerm);
    if (genre) console.log("[MOVIES] Filtro: genre =", genre);
    if (year) console.log("[MOVIES] Filtro: year =", year);
    if (year_from || year_to) {
      console.log("[MOVIES] Filtro: year_from =", year_from, "year_to =", year_to);
    }

    // Pesquisa por título/sinopse
    if (searchTerm) {
      values.push(`%${searchTerm.toLowerCase()}%`);
      const idx = values.length;
      whereClauses.push(
        `(LOWER(m.title) LIKE $${idx} OR LOWER(COALESCE(m.synopsis, '')) LIKE $${idx})`
      );
    }

    // Filtro por género
    if (genre) {
      values.push(genre);
      const idx = values.length;
      whereClauses.push(`m.genre ILIKE $${idx}`);
    }

    // Filtros por ano
    if (year) {
      const y = parseInt(year, 10);
      if (!Number.isNaN(y)) {
        values.push(y);
        const idx = values.length;
        whereClauses.push(`m.year = $${idx}`);
      }
    } else {
      if (year_from) {
        const yf = parseInt(year_from, 10);
        if (!Number.isNaN(yf)) {
          values.push(yf);
          const idx = values.length;
          whereClauses.push(`m.year >= $${idx}`);
        }
      }
      if (year_to) {
        const yt = parseInt(year_to, 10);
        if (!Number.isNaN(yt)) {
          values.push(yt);
          const idx = values.length;
          whereClauses.push(`m.year <= $${idx}`);
        }
      }
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Ordenação
    const sortMap = {
      title: "m.title",
      year: "m.year",
      popularity: "m.popularity_score",
      rating: "avg_rating",
    };

    const sortKey = (sort && sortMap[sort.toLowerCase()]) || sortMap.title;
    const sortDirection =
      order && order.toLowerCase() === "desc" ? "DESC" : "ASC";

    console.log("[MOVIES] Ordenação:", sortKey, sortDirection);

    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;
    values.push(perPage, offset);

    console.log("[MOVIES] LIMIT =", perPage, "OFFSET =", offset);

    const query = `
      SELECT
        m.id,
        m.title,
        m.year,
        m.genre,
        m.synopsis,
        m.popularity_score,
        COALESCE(AVG(r.score), 0)::numeric(3,2) AS avg_rating,
        COUNT(r.id) AS rating_count,
        COUNT(*) OVER() AS total_count
      FROM movies m
      LEFT JOIN ratings r ON r.movie_id = m.id
      ${whereSql}
      GROUP BY m.id
      ORDER BY ${sortKey} ${sortDirection}, m.id ASC
      LIMIT $${limitIndex} OFFSET $${offsetIndex};
    `;

    console.log("[MOVIES] SQL gerado:\n", query);
    console.log("[MOVIES] Valores:", values);

    const result = await db.query(query, values);
    const rows = result.rows || [];

    console.log("[MOVIES] Nº de filmes encontrados:", rows.length);
    if (rows.length > 0) {
      console.log("[MOVIES] Total matching count:", rows[0].total_count);
    } else {
      console.log("[MOVIES] Nenhum filme corresponde aos filtros.");
    }

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
    const totalPages =
      total === 0 ? 0 : Math.ceil(total / (perPage || 1));

    return res.json({
      success: true,
      data: {
        pagination: {
          page: currentPage,
          perPage,
          total,
          totalPages,
        },
        items: rows.map((row) => ({
          id: row.id,
          title: row.title,
          year: row.year,
          genre: row.genre,
          synopsis: row.synopsis,
          popularity_score: row.popularity_score,
          avg_rating:
            row.avg_rating !== null ? Number(row.avg_rating) : 0,
          rating_count: Number(row.rating_count) || 0,
        })),
      },
    });
  } catch (error) {
    console.error("[MOVIES] ERRO ao listar filmes:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao listar filmes",
    });
  }
});

/**
 * GET /movies/:id
 * Detalhe de um filme
 */
router.get("/:id", optionalAuth, async (req, res) => {
  console.log("\n--------------------------------");
  console.log("[MOVIES] GET /movies/:id chamado");
  console.log("[MOVIES] ID pedido:", req.params.id);

  if (req.user) {
    console.log("[MOVIES] User autenticado:", req.user.email, "(id:", req.user.id + ")");
  } else {
    console.log("[MOVIES] Pedido público (sem token)");
  }

  try {
    const movieId = parseInt(req.params.id, 10);

    if (Number.isNaN(movieId) || movieId <= 0) {
      console.warn("[MOVIES] ID inválido recebido:", req.params.id);
      return res.status(400).json({
        success: false,
        message: "ID de filme inválido",
      });
    }

    console.log("[MOVIES] Buscando detalhes do filme no BD...");

    const movieQuery = `
      SELECT
        m.id,
        m.title,
        m.year,
        m.genre,
        m.synopsis,
        m.popularity_score,
        COALESCE(AVG(r.score), 0)::numeric(3,2) AS avg_rating,
        COUNT(r.id) AS rating_count
      FROM movies m
      LEFT JOIN ratings r ON r.movie_id = m.id
      WHERE m.id = $1
      GROUP BY m.id;
    `;

    const movieResult = await db.query(movieQuery, [movieId]);

    if (movieResult.rows.length === 0) {
      console.warn("[MOVIES] Filme não encontrado:", movieId);
      return res.status(404).json({
        success: false,
        message: "Filme não encontrado",
      });
    }

    const movie = movieResult.rows[0];
    console.log("[MOVIES] Filme encontrado:", movie.title);

    // Obtém rating do user (se logado)
    let userRating = null;

    if (req.user && req.user.id) {
      console.log("[MOVIES] Buscando rating do utilizador...");
      const ratingQuery = `
        SELECT id, score, rating_date
        FROM ratings
        WHERE user_id = $1 AND movie_id = $2
        ORDER BY rating_date DESC
        LIMIT 1;
      `;

      const ratingResult = await db.query(ratingQuery, [req.user.id, movieId]);

      if (ratingResult.rows.length > 0) {
        const r = ratingResult.rows[0];
        userRating = {
          id: r.id,
          score: r.score,
          rating_date: r.rating_date,
        };

        console.log("[MOVIES] User já avaliou este filme com score:", r.score);
      } else {
        console.log("[MOVIES] User ainda não avaliou este filme.");
      }
    }

    return res.json({
      success: true,
      data: {
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          synopsis: movie.synopsis,
          popularity_score: movie.popularity_score,
        },
        stats: {
          avg_rating:
            movie.avg_rating !== null ? Number(movie.avg_rating) : 0,
          rating_count: Number(movie.rating_count) || 0,
        },
        user_rating: userRating,
      },
    });
  } catch (error) {
    console.error("[MOVIES] ERRO ao obter detalhes do filme:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao obter detalhes do filme",
    });
  }
});

module.exports = router;
