import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function StarRating({ rating, interactive = false, onRate = () => {} }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let color = "#e2e8f0"; // Empty star
        if (interactive) {
          if (star <= (hoverRating || rating)) {
            color = "#fbbf24"; // Filled star on hover/selection
          }
        } else if (star <= Math.round(rating || 0)) {
          color = "#fbbf24"; // Filled star for display
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            style={{
              cursor: interactive ? "pointer" : "default",
              border: "none",
              background: "none",
              padding: 0,
              fontSize: interactive ? "1.5rem" : "1rem",
              color: color,
              transition: "color 0.2s ease",
            }}
          >
            {star <= (interactive ? hoverRating || rating : Math.round(rating || 0)) ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

export default function Movies() {
  const { user } = useAuth();

  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [userRatingScore, setUserRatingScore] = useState(0);
  const [savingRating, setSavingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState(null);

  // Carregar catálogo
  const fetchMovies = useCallback(
    async (pageOverride) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pageOverride || pagination.page,
          per_page: pagination.perPage,
          sort,
          order,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (genre.trim()) {
          params.genre = genre.trim();
        }

        const response = await api.get("/movies", { params });

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Erro ao carregar filmes");
        }

        const { items, pagination: pg } = response.data.data;

        setMovies(items || []);
        setPagination((prev) => ({
          ...prev,
          page: pg.page,
          perPage: pg.perPage,
          total: pg.total,
          totalPages: pg.totalPages,
        }));
      } catch (err) {
        console.error("Erro ao carregar filmes:", err);
        setError(err.message || "Erro ao carregar filmes");
      } finally {
        setLoading(false);
      }
    },
    [search, genre, sort, order, pagination.page, pagination.perPage]
  );

  useEffect(() => {
    fetchMovies(1);
  }, [search, genre, sort, order, fetchMovies]);

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      (pagination.totalPages && newPage > pagination.totalPages)
    ) {
      return;
    }
    fetchMovies(newPage);
  };

  // Detalhes do filme
  const fetchMovieDetails = async (movieId) => {
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      setRatingMessage(null);
      setSelectedMovieData(null);

      const response = await api.get(`/movies/${movieId}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Erro ao obter detalhes");
      }

      const data = response.data.data;
      setSelectedMovieData(data);

      if (data.user_rating && data.user_rating.score) {
        setUserRatingScore(data.user_rating.score);
      } else {
        setUserRatingScore(0);
      }
    } catch (err) {
      console.error("Erro ao obter detalhes do filme:", err);
      setDetailsError(err.message || "Erro ao obter detalhes do filme");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOpenDetails = (movieId) => {
    setSelectedMovieId(movieId);
    fetchMovieDetails(movieId);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
    setSelectedMovieData(null);
    setDetailsError(null);
    setUserRatingScore(0);
    setRatingMessage(null);
  };

  // Rating
  const handleSaveRating = async () => {
    if (!user) {
      setRatingMessage("Precisas de estar autenticado para avaliar.");
      return;
    }

    if (!selectedMovieData || !selectedMovieData.movie) {
      setRatingMessage("Nenhum filme selecionado.");
      return;
    }

    if (!userRatingScore || userRatingScore < 1 || userRatingScore > 5) {
      setRatingMessage("Escolhe uma classificação entre 1 e 5 estrelas.");
      return;
    }

    try {
      setSavingRating(true);
      setRatingMessage(null);

      const movieId = selectedMovieData.movie.id;

      if (selectedMovieData.user_rating && selectedMovieData.user_rating.id) {
        const ratingId = selectedMovieData.user_rating.id;
        await api.put(`/ratings/${ratingId}`, {
          score: userRatingScore,
        });
        setRatingMessage("Avaliação atualizada com sucesso!");
      } else {
        await api.post("/ratings", {
          movie_id: movieId,
          score: userRatingScore,
        });
        setRatingMessage("Avaliação criada com sucesso!");
      }

      await fetchMovieDetails(movieId);
      await fetchMovies(pagination.page);
    } catch (err) {
      console.error("Erro ao guardar avaliação:", err);
      setRatingMessage(
        err.response?.data?.message ||
          err.message ||
          "Erro ao guardar avaliação."
      );
    } finally {
      setSavingRating(false);
    }
  };

  return (
    <div className="movies-page">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Catálogo de Filmes</h1>
            <p className="subtitle">
              Aqui podes <strong>pesquisar</strong>, <strong>filtrar</strong> e{" "}
              <strong>explorar</strong> o catálogo de filmes. Podes também ver
              detalhes e <strong>avaliar</strong> cada filme.
            </p>
          </div>
          
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          )}
        </header>

        {/* Search and Filters */}
        <section className="filters-section">
          <div className="search-bar">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título ou sinopse..."
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Género</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="ex: Sci-Fi, Action..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Ordenar por</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="filter-select"
              >
                <option value="title">Título</option>
                <option value="year">Ano</option>
                <option value="popularity">Popularidade</option>
                <option value="rating">Rating médio</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Ordem</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="filter-select"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setGenre("");
                setSort("title");
                setOrder("asc");
              }}
              className="clear-filters"
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* Content */}
        <main className="main-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>A carregar filmes...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <div>
                <h3>Erro ao carregar catálogo</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>Nenhum filme encontrado</h3>
              <p>Tenta ajustar os filtros ou remover algum critério de pesquisa.</p>
            </div>
          )}

          {!loading && movies.length > 0 && (
            <>
              <div className="results-header">
                <h2>Resultados</h2>
                <span className="results-count">
                  {movies.length} de {pagination.total} filmes
                </span>
              </div>

              <div className="movies-grid">
                {movies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <div className="movie-header">
                      <h3 className="movie-title">
                        {movie.title}
                        {movie.year && (
                          <span className="movie-year"> ({movie.year})</span>
                        )}
                      </h3>
                      {movie.genre && (
                        <span className="movie-genre">{movie.genre}</span>
                      )}
                    </div>

                    {movie.synopsis && (
                      <p className="movie-synopsis">
                        {movie.synopsis.length > 120
                          ? movie.synopsis.slice(0, 120) + "..."
                          : movie.synopsis}
                      </p>
                    )}

                    <div className="movie-footer">
                      <div className="movie-rating">
                        <StarRating rating={movie.avg_rating} />
                        <div className="rating-details">
                          <span className="rating-score">
                            {Number(movie.avg_rating || 0).toFixed(1)}/5
                          </span>
                          <span className="rating-count">
                            ({movie.rating_count || 0} avaliações)
                          </span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(movie.id)}
                        className="details-button"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="pagination-button prev"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="page-info">
                    Página <strong>{pagination.page}</strong> de{" "}
                    <strong>{pagination.totalPages}</strong>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="pagination-button next"
                  >
                    Seguinte →
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Movie Details Modal */}
        {selectedMovieId && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Detalhes do filme</h2>
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="close-button"
                >
                  ✕
                </button>
              </div>

              {detailsLoading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>A carregar detalhes...</p>
                </div>
              )}

              {detailsError && (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <div>
                    <h3>Erro ao carregar detalhes</h3>
                    <p>{detailsError}</p>
                  </div>
                </div>
              )}

              {selectedMovieData && (
                <div className="modal-content">
                  <div className="movie-details-header">
                    <h3>
                      {selectedMovieData.movie.title}
                      {selectedMovieData.movie.year && (
                        <span className="movie-year"> ({selectedMovieData.movie.year})</span>
                      )}
                    </h3>
                    {selectedMovieData.movie.genre && (
                      <span className="movie-genre">{selectedMovieData.movie.genre}</span>
                    )}
                  </div>

                  {selectedMovieData.movie.synopsis && (
                    <div className="movie-synopsis-full">
                      <h4>Sinopse</h4>
                      <p>{selectedMovieData.movie.synopsis}</p>
                    </div>
                  )}

                  <div className="movie-stats">
                    <div className="stat">
                      <div className="stat-label">Rating médio</div>
                      <div className="stat-value">
                        {Number(selectedMovieData.stats.avg_rating || 0).toFixed(1)}/5
                      </div>
                      <StarRating rating={selectedMovieData.stats.avg_rating} />
                    </div>
                    <div className="stat">
                      <div className="stat-label">Total de avaliações</div>
                      <div className="stat-value">
                        {selectedMovieData.stats.rating_count}
                      </div>
                    </div>
                  </div>

                  {/* User Rating Section */}
                  <div className="user-rating-section">
                    <h4>A tua avaliação</h4>
                    
                    {!user ? (
                      <p className="login-prompt">
                        Faz login para poderes avaliar este filme.
                      </p>
                    ) : (
                      <>
                        <div className="rating-input">
                          <p>Seleciona a tua classificação:</p>
                          <StarRating
                            rating={userRatingScore}
                            interactive={true}
                            onRate={setUserRatingScore}
                          />
                          <div className="rating-score-display">
                            {userRatingScore > 0 ? `${userRatingScore}/5` : "Nenhuma selecionada"}
                          </div>
                        </div>

                        {selectedMovieData.user_rating && (
                          <div className="previous-rating">
                            ⏺️ A tua última avaliação foi{" "}
                            <strong>{selectedMovieData.user_rating.score}/5</strong>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleSaveRating}
                          disabled={savingRating || userRatingScore === 0}
                          className="save-rating-button"
                        >
                          {savingRating ? (
                            <>
                              <div className="spinner small"></div>
                              A guardar...
                            </>
                          ) : (
                            "Guardar avaliação"
                          )}
                        </button>

                        {ratingMessage && (
                          <div className={`rating-message ${ratingMessage.includes("sucesso") ? "success" : "error"}`}>
                            {ratingMessage}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .movies-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .subtitle {
          color: #64748b;
          font-size: 15px;
          line-height: 1.5;
          margin: 0;
          max-width: 600px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .user-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
        }

        .user-email {
          color: #64748b;
          font-size: 12px;
        }

        /* Filters */
        .filters-section {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-icon {
          font-size: 20px;
          color: #64748b;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-group label {
          display: block;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .clear-filters {
          align-self: flex-end;
          padding: 12px 20px;
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filters:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Main Content */
        .main-content {
          min-height: 400px;
        }

        .loading-state,
        .empty-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
          margin: 0 8px 0 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-icon,
        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3,
        .error-state h3 {
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .empty-state p,
        .error-state p {
          margin: 0;
          color: #64748b;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .results-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
          font-weight: 600;
        }

        .results-count {
          color: #64748b;
          font-size: 14px;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 20px;
        }

        /* Movies Grid */
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .movie-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .movie-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .movie-header {
          margin-bottom: 12px;
        }

        .movie-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.3;
        }

        .movie-year {
          font-weight: normal;
          color: #64748b;
          font-size: 14px;
        }

        .movie-genre {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .movie-synopsis {
          margin: 0 0 16px 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
        }

        .movie-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .movie-rating {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rating-details {
          display: flex;
          gap: 8px;
          font-size: 12px;
        }

        .rating-score {
          color: #f59e0b;
          font-weight: 600;
        }

        .rating-count {
          color: #94a3b8;
        }

        .details-button {
          padding: 8px 16px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-button:hover {
          background: #e2e8f0;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          padding: 24px 0;
          border-top: 1px solid #e2e8f0;
        }

        .pagination-button {
          padding: 10px 20px;
          background: white;
          color: #475569;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: white;
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 24px;
          font-weight: 600;
        }

        .close-button {
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 18px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #e2e8f0;
        }

        .modal-content {
          padding: 24px;
        }

        .movie-details-header {
          margin-bottom: 24px;
        }

        .movie-details-header h3 {
          margin: 0 0 12px 0;
          font-size: 22px;
          color: #0f172a;
        }

        .movie-synopsis-full h4 {
          margin: 0 0 12px 0;
          color: #0f172a;
          font-size: 16px;
          font-weight: 600;
        }

        .movie-synopsis-full p {
          margin: 0 0 24px 0;
          color: #475569;
          line-height: 1.6;
          font-size: 15px;
        }

        .movie-stats {
          display: flex;
          gap: 32px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .stat {
          flex: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .stat-value {
          color: #0f172a;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        /* User Rating */
        .user-rating-section {
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .user-rating-section h4 {
          margin: 0 0 16px 0;
          color: #0f172a;
          font-size: 18px;
          font-weight: 600;
        }

        .login-prompt {
          margin: 0;
          color: #64748b;
          font-style: italic;
        }

        .rating-input {
          margin-bottom: 20px;
        }

        .rating-input p {
          margin: 0 0 12px 0;
          color: #475569;
          font-size: 14px;
        }

        .rating-score-display {
          margin-top: 8px;
          color: #3b82f6;
          font-weight: 600;
          font-size: 14px;
        }

        .previous-rating {
          background: white;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .save-rating-button {
          width: 100%;
          padding: 14px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-rating-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .save-rating-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rating-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .rating-message.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .rating-message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .header {
            flex-direction: column;
            gap: 16px;
          }

          .movies-grid {
            grid-template-columns: 1fr;
          }

          .modal {
            max-height: 80vh;
          }

          .movie-stats {
            flex-direction: column;
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 24px;
          }

          .filter-controls {
            flex-direction: column;
          }

          .filter-group {
            min-width: 100%;
          }

          .pagination {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}