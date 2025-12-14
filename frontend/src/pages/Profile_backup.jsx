import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();

  const [profileUser, setProfileUser] = useState(user || null);
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

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {profileUser?.name?.charAt(0).toUpperCase() || "👤"}
            </div>
            <h1>Perfil do Utilizador</h1>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>A carregar perfil...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <strong>Erro:</strong> {error}
              </div>
            </div>
          )}

          {!loading && !profileUser && !error && (
            <div className="empty-state">
              <p>Não foi possível obter os dados do utilizador.</p>
            </div>
          )}

          {!loading && profileUser && (
            <>
              <div className="profile-info">
                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">👤</span>
                    Nome
                  </div>
                  <div className="info-value">{profileUser.name}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">📧</span>
                    Email
                  </div>
                  <div className="info-value">{profileUser.email}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">📅</span>
                    Membro desde
                  </div>
                  <div className="info-value">{formattedDate}</div>
                </div>
              </div>

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
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .profile-container {
          width: 100%;
          max-width: 500px;
        }

        .profile-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 32px 60px;
          text-align: center;
          color: white;
          position: relative;
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
          margin: 0 auto 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .profile-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .profile-info {
          padding: 40px 32px 32px;
          margin-top: -40px;
          background: white;
          border-radius: 24px 24px 0 0;
        }

        .info-item {
          margin-bottom: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .info-icon {
          font-size: 16px;
        }

        .info-value {
          font-size: 18px;
          color: #0f172a;
          font-weight: 500;
        }

        .profile-actions {
          padding: 0 32px 32px;
        }

        .logout-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }

        .button-icon {
          font-size: 18px;
        }

        .loading-state {
          padding: 60px 32px;
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .error-message {
          margin: 32px;
          padding: 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #dc2626;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .error-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .error-content {
          flex: 1;
          font-size: 14px;
          line-height: 1.5;
        }

        .empty-state {
          padding: 60px 32px;
          text-align: center;
          color: #64748b;
          font-size: 16px;
        }

        @media (max-width: 640px) {
          .profile-page {
            padding: 16px;
          }

          .profile-header {
            padding: 32px 24px 48px;
          }

          .profile-header h1 {
            font-size: 24px;
          }

          .profile-info {
            padding: 32px 24px 24px;
          }

          .info-item {
            padding: 16px;
          }

          .profile-actions {
            padding: 0 24px 24px;
          }

          .avatar {
            width: 64px;
            height: 64px;
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}