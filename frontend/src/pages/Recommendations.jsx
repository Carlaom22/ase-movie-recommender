import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const color = star <= Math.round(rating || 0) ? "#fbbf24" : "#e2e8f0";
        return (
          <span
            key={star}
            style={{
              fontSize: "1rem",
              color: color,
            }}
          >
            {star <= Math.round(rating || 0) ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();

  const [recs, setRecs] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/recommendations");

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Erro ao obter recomendações");
        }

        const data = response.data.data;
        setRecs(data.items || []);
        setStrategy(data.strategy || null);
        setFavoriteGenres(data.favoriteGenres || []);
      } catch (err) {
        console.error("Erro ao obter recomendações:", err);
        setError(err.response?.data?.message || err.message || "Erro ao obter recomendações");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="recommendations-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h3>Recomendações Personalizadas</h3>
            <p>Faz login para veres sugestões ajustadas ao teu gosto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Recomendações para ti</h1>
            <p className="subtitle">
              Baseado nas tuas avaliações, sugerimos filmes que acreditamos que vais gostar.
            </p>
            
            {(strategy === "top_genres" && favoriteGenres.length > 0) && (
              <div className="strategy-badge">
                📊 Baseado nos teus géneros favoritos: <strong>{favoriteGenres.join(", ")}</strong>
              </div>
            )}
            {strategy === "popular_fallback" && (
              <div className="strategy-badge">
                🔥 Baseado nos filmes populares que ainda não avaliaste
              </div>
            )}
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

        {/* Content */}
        <main className="main-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>A gerar recomendações personalizadas...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <div>
                <h3>Erro ao gerar recomendações</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && recs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>Sem sugestões ainda</h3>
              <p>Avalia alguns filmes no catálogo para desbloquear recomendações personalizadas.</p>
            </div>
          )}

          {!loading && recs.length > 0 && (
            <>
              <div className="results-header">
                <h2>Sugestões personalizadas</h2>
                <span className="results-count">
                  {recs.length} {recs.length === 1 ? "filme" : "filmes"}
                </span>
              </div>

              <div className="movies-grid">
                {recs.map((movie) => (
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
                        {movie.synopsis.length > 150
                          ? movie.synopsis.slice(0, 150) + "..."
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
                      {movie.popularity_score != null && (
                        <div className="popularity-badge">
                          🔥 {movie.popularity_score}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <style jsx>{`
        .recommendations-page {
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
          margin: 0 0 12px 0;
          max-width: 600px;
        }

        .strategy-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          color: #0369a1;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          margin-top: 8px;
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
          align-items: center;
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

        .popularity-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #fde68a;
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
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
