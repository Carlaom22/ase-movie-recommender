import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function renderStars(avg) {
  const rounded = Math.round(avg || 0);
  const full = "★".repeat(rounded);
  const empty = "☆".repeat(5 - rounded);
  return full + empty;
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
      <div>
        <h1>Recomendações</h1>
        <p>Faz login para veres recomendações personalizadas.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Recomendações para ti</h1>
      <p>
        Baseado nas tuas avaliações, sugerimos filmes que achamos que vais gostar.
      </p>

      <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
        Autenticado como <strong>{user.name}</strong> ({user.email})
      </p>

      {loading && <p>A gerar recomendações...</p>}

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #f44336",
            backgroundColor: "#ffebee",
            maxWidth: "600px",
            marginBottom: "1rem",
          }}
        >
          <p>
            <strong>Erro:</strong> {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555" }}>
            {strategy === "top_genres" && favoriteGenres.length > 0 && (
              <p>
                Estratégia usada: <strong>géneros favoritos</strong> (
                {favoriteGenres.join(", ")}).
              </p>
            )}
            {strategy === "popular_fallback" && (
              <p>
                Estratégia usada: <strong>filmes populares</strong> que ainda não
                avaliás-te.
              </p>
            )}
          </div>

          {recs.length === 0 ? (
            <p>De momento não temos sugestões para ti. Tenta avaliar alguns filmes primeiro!</p>
          ) : (
            <>
              <p style={{ fontSize: "0.9rem" }}>
                Encontrámos <strong>{recs.length}</strong> filmes recomendados.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recs.map((movie) => (
                  <div
                    key={movie.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ margin: 0 }}>
                          {movie.title}{" "}
                          {movie.year && (
                            <span
                              style={{ fontWeight: "normal", fontSize: "0.9rem" }}
                            >
                              ({movie.year})
                            </span>
                          )}
                        </h3>
                        {movie.genre && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.9rem",
                              color: "#555",
                            }}
                          >
                            Género: {movie.genre}
                          </p>
                        )}
                      </div>

                      <div style={{ textAlign: "right", minWidth: "160px" }}>
                        <div style={{ fontSize: "1rem" }}>
                          {renderStars(movie.avg_rating)}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#555" }}>
                          {movie.avg_rating?.toFixed
                            ? movie.avg_rating.toFixed(1)
                            : Number(movie.avg_rating || 0).toFixed(1)}{" "}
                          / 5 ({movie.rating_count} rating
                          {movie.rating_count === 1 ? "" : "s"})
                        </div>
                        {movie.popularity_score != null && (
                          <div style={{ fontSize: "0.8rem", color: "#777" }}>
                            Popularidade: {movie.popularity_score}
                          </div>
                        )}
                      </div>
                    </div>

                    {movie.synopsis && (
                      <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
                        {movie.synopsis.length > 220
                          ? movie.synopsis.slice(0, 220) + "..."
                          : movie.synopsis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
