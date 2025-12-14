import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();

  const [profileUser, setProfileUser] = useState(user || null);
  const [stats, setStats] = useState({ ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        const response = await api.get("/users/me");

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Erro ao obter perfil");
        }

        setProfileUser(response.data.data.user);
        setStats(response.data.data.stats || { ratings: 0 });
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erro ao carregar perfil."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      logout();
    } catch (err) {
      console.error("Erro no logout:", err);
      logout();
    }
  };

  const formattedDate =
    profileUser && profileUser.created_at
      ? new Date(profileUser.created_at).toLocaleDateString("pt-PT")
      : "N/D";

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h2>Acesso Restrito</h2>
            <p>Faz login para veres o teu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Meu Perfil</h1>
            <p className="subtitle">Aqui podes ver os teus dados e gerenciar a tua conta.</p>
          </div>
        </header>

        {loading && (
          <div className="status-card loading">
            <div className="spinner" />
            <div>
              <h3>A carregar perfil...</h3>
              <p>Estamos a recuperar os teus dados.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="status-card error">
            <div className="status-icon">⚠️</div>
            <div>
              <h3>Erro ao carregar perfil</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && profileUser && (
          <>
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-header-section">
                <div className="avatar">
                  {profileUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-main-info">
                  <h2>{profileUser.name}</h2>
                  <p className="email">{profileUser.email}</p>
                </div>
              </div>

              <div className="profile-content">
                <div className="info-grid">
                  <div className="info-box">
                    <div className="info-box-icon">📧</div>
                    <div className="info-box-label">Email</div>
                    <div className="info-box-value">{profileUser.email}</div>
                  </div>

                  <div className="info-box">
                    <div className="info-box-icon">📅</div>
                    <div className="info-box-label">Membro desde</div>
                    <div className="info-box-value">{formattedDate}</div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="profile-actions">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <span className="button-icon">🚪</span>
                    Terminar Sessão
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <div className="info-card">
                <div className="info-card-icon">🎬</div>
                <h3>Próximos Passos</h3>
                <ul>
                  <li>Explora o <strong>catálogo de filmes</strong> completo</li>
                  <li>Avalia os teus filmes favoritos</li>
                  <li>Recebe <strong>recomendações personalizadas</strong> baseadas nas tuas avaliações</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {!loading && !profileUser && !error && (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h2>Dados indisponíveis</h2>
            <p>Não foi possível carregar os dados do teu perfil.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 32px 16px 48px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .header {
          margin-bottom: 32px;
        }

        .header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: #0f172a;
        }

        .subtitle {
          margin: 0;
          color: #64748b;
          font-size: 15px;
        }

        /* Status Cards */
        .status-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: white;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 14px 16px;
          margin-bottom: 16px;
        }

        .status-card h3 {
          margin: 0 0 4px 0;
          color: #0f172a;
          font-size: 16px;
        }

        .status-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .status-card.error {
          border-color: #fecdd3;
          background: #fff1f2;
        }

        .status-icon {
          font-size: 24px;
        }

        .spinner {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Profile Card */
        .profile-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .profile-header-section {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          padding: 32px 24px;
          color: white;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .profile-main-info h2 {
          margin: 0;
          font-size: 24px;
        }

        .email {
          margin: 4px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .profile-content {
          padding: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .info-box-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .info-box-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .info-box-value {
          color: #0f172a;
          font-size: 18px;
          font-weight: 700;
        }

        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 24px 0;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .logout-button {
          flex: 1;
          padding: 14px 16px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
          gap: 8px;
          box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(220, 38, 38, 0.4);
        }

        .button-icon {
          font-size: 16px;
        }

        /* Info Section */
        .info-section {
          display: grid;
          gap: 16px;
        }

        .info-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .info-card-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .info-card h3 {
          margin: 0 0 16px 0;
          color: #0f172a;
          font-size: 18px;
        }

        .info-card ul {
          margin: 0;
          padding: 0 0 0 20px;
          list-style: disc;
          color: #475569;
          line-height: 1.8;
        }

        .info-card li {
          margin-bottom: 8px;
        }

        .info-card strong {
          color: #0f172a;
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h2 {
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .empty-state p {
          margin: 0;
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-header-section {
            flex-direction: column;
            text-align: center;
          }

          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 24px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .profile-header-section {
            padding: 24px 16px;
          }

          .profile-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
