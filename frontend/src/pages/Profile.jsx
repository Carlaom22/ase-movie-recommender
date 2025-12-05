import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Perfil do Utilizador</h1>
      {user ? (
        <div>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Membro desde:</strong> {new Date(user.created_at).toLocaleDateString('pt-PT')}</p>
          
          <div style={{ marginTop: "20px" }}>
            <button 
              onClick={logout}
              style={{ 
                background: "#dc3545", 
                color: "white", 
                border: "none", 
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "4px"
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Carregando dados do utilizador...</p>
      )}
    </div>
  );
}
