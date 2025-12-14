# Relatório Técnico – ASE Movie Recommender

**Data**: Dezembro 2025  
**Projeto**: ASE Movie Recommender — Sistema de Recomendação de Filmes  
**Equipa**: Bernardo, Bruno, Carlos, Lucas, Miguel

---

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Arquitetura Geral](#arquitetura-geral)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Base de Dados](#base-de-dados)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [API REST — Endpoints](#api-rest--endpoints)
8. [Pipeline CI/CD](#pipeline-cicd)
9. [Containerização e Infra](#containerização-e-infra)
10. [Análise de Qualidade e Melhorias](#análise-de-qualidade-e-melhorias)

---

## Resumo Executivo

O **ASE Movie Recommender** é uma aplicação full-stack para recomendação personalizada de filmes, permitindo aos utilizadores:
- Registar-se, fazer login e manter uma conta pessoal.
- Navegar um catálogo de ~44 filmes com filtros, ordenação e paginação.
- Avaliar filmes (escala de 1 a 5 estrelas).
- Receber recomendações personalizadas usando três estratégias: content-based (géneros favoritos), collaborative filtering e fallback por popularidade.
- Gerir perfil, ver histórico de recomendações.

**Stack técnico:**
- **Backend**: Node.js + Express, PostgreSQL
- **Frontend**: React (Vite), CSS-in-JS com scoped styles
- **DevOps**: Docker Compose, GitHub Actions (CI básico)
- **Autenticação**: JWT (JSON Web Tokens)

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│                    Utilizador                        │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
   ┌────▼─────┐            ┌───────▼──────┐
   │ Frontend  │            │  Backend API │
   │  (React)  │◄──HTTP────►│  (Express)   │
   │  Vite     │            │  Port 3000   │
   │ Port 5173 │            └───────┬──────┘
   └──────────┘                    │
                                   │
                            ┌──────▼──────┐
                            │ PostgreSQL   │
                            │   (BD)       │
                            │ Port 5432    │
                            └─────────────┘
```

---

## Backend

### Estrutura de Ficheiros

```
backend/
├── index.js                    # Entrada da aplicação, setup de rotas
├── db.js                       # Pool de conexão PostgreSQL
├── package.json                # Dependências
├── Dockerfile                  # Imagem Docker
├── middleware/
│   └── auth.js                 # Middlewares JWT (authenticateToken, optionalAuth)
├── routes/
│   ├── auth.js                 # POST /auth/register, POST /auth/login
│   ├── movies.js               # GET /movies (com filtros, paginação)
│   ├── ratings.js              # POST /ratings, GET /ratings/:movieId
│   ├── recommendations.js      # GET /recommendations, POST /recommendations/refresh
│   └── users.js                # GET /users/me
└── utils/
    └── auth.js                 # hashPassword, generateToken, validatePassword, etc.
```

### Entrypoint Principal (`index.js`)

- **Porta**: 3000 (ou env `PORT`)
- **CORS**: Configurado para aceitar requisições de `http://localhost:5173` (frontend)
- **Metrics**: Endpoints `/health` e `/metrics` para monitorização
- **Rotas registadas**:
  - `/auth` — Autenticação
  - `/movies` — Catálogo
  - `/ratings` — Avaliações
  - `/recommendations` — Recomendações
  - `/users` — Perfil

### Dependências Backend

```json
{
  "bcryptjs": "^3.0.3",           // Hashing de passwords
  "cors": "^2.8.5",                // CORS
  "dotenv": "^16.4.0",             // Variáveis de ambiente
  "express": "^4.19.0",            // Framework HTTP
  "jsonwebtoken": "^9.0.2",        // JWT
  "pg": "^8.12.0",                 // Driver PostgreSQL
  "nodemon": "^3.1.0"              // Dev: auto-reload
}
```

### Pool de Base de Dados (`db.js`)

```javascript
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "ase_user",
  password: process.env.DB_PASSWORD || "ase_password",
  database: process.env.DB_NAME || "ase_movies"
});
```

**Features**:
- Parametrização automática para evitar SQL injection
- Test connection em desenvolvimento
- Reconexão automática via pool

---

## Frontend

### Estrutura de Ficheiros

```
frontend/src/
├── App.jsx                       # Router principal e navegação
├── main.jsx                      # Entry point Vite
├── index.css                     # Estilos globais
├── App.css                       # Estilos da aplicação e Register
├── contexts/
│   ├── authContext.js           # Contexto React para autenticação (exports função createAuthContext)
│   └── AuthContext.jsx          # Componente provider
├── hooks/
│   └── useAuth.js               # Hook customizado para acessar context
├── components/
│   └── ProtectedRoute.jsx        # HOC para rotas privadas
├── pages/
│   ├── Login.jsx                 # Página de login (Bem-vindo + formulário)
│   ├── Register.jsx              # Página de registo (Hero + formulário)
│   ├── Register_NEW.jsx          # Versão redesenhada (não ativa)
│   ├── Movies.jsx                # Catálogo (grid, filtros, paginação)
│   ├── Recommendations.jsx       # Recomendações pessoalizadas
│   ├── Recommendations_REDESIGN.jsx  # Versão redesenhada
│   ├── Profile.jsx               # Perfil do utilizador
│   └── Profile_backup.jsx        # Backup
└── services/
    └── api.js                    # Classe API com métodos para cada endpoint
```

### Stack Frontend

- **Framework**: React 18+ (Vite bundler)
- **Roteamento**: react-router-dom
- **Styling**: CSS-in-JS com `<style jsx>` (scoped)
- **Estado Global**: Context API (useContext)

### AuthContext

Implementação centralizada de autenticação:

```javascript
// Em authContext.js
export function createAuthContext() {
  return {
    isAuthenticated: false,
    user: null,
    login: async (email, password) => { /* ... */ },
    register: async (name, email, password) => { /* ... */ },
    logout: () => { /* ... */ }
  };
}

// Em AuthContext.jsx — wrapper provider
export function AuthProvider({ children }) {
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
}

// Em useAuth.js
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
```

**Fluxo**:
1. User faz login/registo via página
2. AuthContext chama `api.login()` ou `api.register()`
3. Backend retorna token JWT
4. Context armazena token no `localStorage`
5. Token incluído automaticamente em requisições futuras (`Authorization: Bearer TOKEN`)

### Roteamento (`App.jsx`)

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
  <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
  <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
</Routes>
```

**ProtectedRoute**: Redireciona para login se não autenticado.

### Páginas Principais

#### **Movies.jsx** — Catálogo
- Grid responsivo com paginação (20 por página)
- Filtros: título, género, ano
- Ordenação: popularidade, rating, ano
- Modal para detalhes do filme
- Avaliação in-place (estrelas)

**Estado**:
```javascript
const [movies, setMovies] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
const [filters, setFilters] = useState({ search: "", genre: "", year: "" });
const [selectedMovie, setSelectedMovie] = useState(null);  // Modal
```

#### **Recommendations.jsx** — Recomendações
- Estratégia utilizada indicada (top_genres / popular_fallback)
- Lista de filmes recomendados com badges e sinopses
- Estados: loading, empty, error
- Botão para refresh manual

#### **Profile.jsx** — Perfil
- Dados do utilizador: email, nome, data de criação
- Contagem de ratings efectuados
- Logout

#### **Login.jsx** e **Register.jsx**
- Formulários com validação cliente
- Mensagens de erro descritivas
- Redirecionamento automático pós-sucesso

---

## Base de Dados

### Schema (`database/init.sql`)

#### **Tabelas**

1. **`users`**
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **`movies`**
   ```sql
   CREATE TABLE movies (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     year INT,
     genre VARCHAR(100),
     synopsis TEXT,
     popularity_score NUMERIC(5,2) DEFAULT 0
   );
   ```

3. **`ratings`**
   ```sql
   CREATE TABLE ratings (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
     score INT NOT NULL CHECK (score >= 1 AND score <= 5),
     rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
   );
   ```
   - **Índices**: `idx_ratings_user_id`, `idx_ratings_movie_id` para queries rápidas

4. **`recommendations`**
   ```sql
   CREATE TABLE recommendations (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
     rank INT NOT NULL,
     reason VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
   - **Índice**: `idx_recommendations_user_id`

### Seeds

- **20+ filmes** com títulos, anos, géneros, sinopses e scores de popularidade
- **Utilizador demo**: `demo@example.com` (senha: demo)
- **Ratings de exemplo**: 3 ratings do utilizador demo em filmes clássicos

---

## Autenticação e Autorização

### Fluxo JWT

1. **Registo** (`POST /auth/register`):
   - Valida email, password (mínimo 6 caracteres)
   - Hash password com `bcryptjs` (10 rounds)
   - Insere utilizador na BD
   - Gera token JWT
   - Retorna token + dados utilizador

2. **Login** (`POST /auth/login`):
   - Verifica email e password
   - Compara hash
   - Gera token JWT
   - Retorna token

3. **Uso do Token**:
   - Cliente armazena em `localStorage`
   - Envia em cada requisição: `Authorization: Bearer <TOKEN>`
   - Middleware `authenticateToken` valida e extrai dados

### Middleware (`backend/middleware/auth.js`)

#### **authenticateToken**
```javascript
const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [decoded.userId]);
    req.user = user.rows[0];
    next();
  } catch (error) {
    // Trata TokenExpiredError, JsonWebTokenError, etc.
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
```

#### **optionalAuth**
```javascript
const optionalAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [decoded.userId]);
      req.user = user.rows[0];
    } catch (error) {
      // Continua sem erro
    }
  }
  next();
};
```

**Caso de Uso**: `/movies` permite listagem pública, mas identifica utilizadores autenticados para recomendações futuras.

### Segurança

- **Password**: Hashed com bcryptjs (10 rounds), nunca armazenado em plain text
- **JWT Secret**: Esperado em env `JWT_SECRET` (deve ser gerado seguro em produção)
- **SQL Injection**: Prevenido via parametrização (`$1`, `$2`, etc.)
- **CORS**: Restringido a `http://localhost:5173`

---

## API REST — Endpoints

### Autenticação

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/register` | ✗ | Regista novo utilizador |
| POST | `/auth/login` | ✗ | Login e obtenção de token |
| GET | `/auth/test` | ✗ | Teste de rota |

**Exemplo: POST `/auth/register`**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha_segura_123"
}
```

**Resposta (201)**:
```json
{
  "success": true,
  "message": "Utilizador registado com sucesso",
  "data": {
    "user": { "id": 1, "name": "João Silva", "email": "joao@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Filmes

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/movies` | opt | Catálogo com filtros e paginação |
| GET | `/movies/test` | ✗ | Teste de rota |

**Query Parameters** para `GET /movies`:
- `search` ou `q`: Busca por título
- `genre`: Filtrar por género
- `year`: Filtro por ano exato
- `year_from`, `year_to`: Intervalo de anos
- `sort`: Campo (popularity, year, title)
- `order`: ASC ou DESC
- `page`: Número da página (default 1)
- `per_page`: Itens por página (default 20)

**Exemplo**: `GET /movies?genre=Sci-Fi&sort=popularity&order=DESC&page=1&per_page=10`

**Resposta**:
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": 1,
        "title": "Inception",
        "year": 2010,
        "genre": "Sci-Fi",
        "synopsis": "...",
        "popularity_score": "9.3",
        "avg_rating": "4.5",
        "rating_count": 3
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total_movies": 44,
      "total_pages": 5
    },
    "filters_applied": { "genre": "Sci-Fi" }
  }
}
```

### Avaliações

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/ratings` | ✓ | Avaliar um filme (1-5 estrelas) |
| GET | `/ratings/:movieId` | ✗ | Ver avaliações de um filme |
| GET | `/ratings/test` | ✗ | Teste de rota |

**Exemplo: POST `/ratings`**
```json
{
  "movie_id": 5,
  "score": 5
}
```

**Resposta (201)**:
```json
{
  "success": true,
  "message": "Avaliação registada com sucesso",
  "data": {
    "id": 42,
    "user_id": 1,
    "movie_id": 5,
    "score": 5,
    "rating_date": "2025-12-14T10:30:00Z"
  }
}
```

### Recomendações

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/recommendations` | ✓ | Obter recomendações para utilizador |
| GET | `/recommendations/saved` | ✓ | Histórico de recomendações salvas |
| POST | `/recommendations/refresh` | ✓ | Recalcular recomendações |
| GET | `/recommendations/test` | ✗ | Teste de rota |

**Algoritmo em `/recommendations`**:

1. **Extrair géneros favoritos** (top 3 com maior rating médio)
   ```sql
   SELECT genre, AVG(score) as avg_score
   FROM ratings JOIN movies ON ...
   WHERE user_id = $1
   GROUP BY genre
   ORDER BY avg_score DESC
   LIMIT 3
   ```

2. **Se há géneros favoritos** (estratégia: **top_genres**)
   - Recomenda filmes desses géneros
   - Excluindo filmes já avaliados pelo utilizador
   - Ordena por rating médio, contagem de ratings, popularidade

3. **Se não há géneros favoritos** (estratégia: **popular_fallback**)
   - Recomenda filmes mais populares
   - Excluindo os já avaliados

**Resposta**:
```json
{
  "success": true,
  "data": {
    "strategy": "top_genres",
    "favorite_genres": ["Sci-Fi", "Action", "Drama"],
    "recommendations": [
      {
        "id": 2,
        "title": "Interstellar",
        "genre": "Sci-Fi",
        "synopsis": "...",
        "popularity_score": "9.4",
        "avg_rating": "9.4"
      }
    ]
  }
}
```

### Utilizadores

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/users/me` | ✓ | Dados do utilizador autenticado |
| GET | `/users/test` | ✗ | Teste de rota |

**Resposta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2025-12-01T15:00:00Z",
    "stats": {
      "total_ratings": 5
    }
  }
}
```

---

## Pipeline CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)

**Trigger**: Push para `main` ou pull requests

**Estrutura**:

```yaml
jobs:
  backend-ci:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node.js 20
      - Install dependencies (npm ci)
      - Run tests (npm test)

  frontend-ci:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node.js 20
      - Install dependencies (npm ci)
      - Run linter (ESLint)
      - Build (npm run build)
```

### Estado Atual

✅ **Implementado**:
- Node.js 20 setup
- Dependency caching (npm cache)
- Install e test execution

⚠️ **Em Desenvolvimento / Sugestões**:
- [ ] Testes automatizados (unit + integration)
- [ ] Docker build & push
- [ ] Deploy automático (staging)
- [ ] Análise de segurança (Snyk, OWASP)
- [ ] Relatórios de cobertura de testes

---

## Containerização e Infra

### Docker Compose (`docker-compose.yml`)

```yaml
services:
  db:
    image: postgres:16
    container_name: ase_db
    environment:
      POSTGRES_USER: ase_user
      POSTGRES_PASSWORD: ase_password
      POSTGRES_DB: ase_movies
    ports:
      - "5432:5432"
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ase_user -d ase_movies"]
      interval: 5s
      timeout: 3s
      retries: 5

  backend:
    build: ./backend
    container_name: ase_backend
    depends_on:
      - db
    environment:
      PORT: 3000
      NODE_ENV: production
      DB_HOST: db
      DB_PORT: 5432
      # ... restante configuração
    ports:
      - "3000:3000"

volumes:
  db_data:
```

### Dockerfile Backend

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### Variáveis de Ambiente

Esperadas em `.env` (backend):
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=ase_user
DB_PASSWORD=ase_password
DB_NAME=ase_movies
JWT_SECRET=tua_chave_secreta_aqui
```

### Startup Local

```bash
# 1. Clonar e navegar
git clone <repo> && cd ase-movie-recommender

# 2. Backend
cd backend
npm install
# Criar .env e preencher
npm run dev

# 3. Database (noutra terminal)
cd .. && docker-compose up -d db

# 4. Frontend (noutra terminal)
cd frontend
npm install
npm run dev
```

---

## Análise de Qualidade e Melhorias

### Pontos Fortes ✅

1. **Arquitetura limpa**: Separação clara entre rotas, middleware, utils
2. **Autenticação robusta**: JWT + bcryptjs, validações e tratamento de erros
3. **Base de dados relacional bem desenhada**: Schema normalizado, constraints apropriadas, índices
4. **API RESTful**: Endpoints com nomes semânticos, query params bem estruturados
5. **Frontend responsivo**: Grid CSS, scoped styles, estado via Context API
6. **Logging básico**: Mensagens descritivas em rotas críticas
7. **Docker ready**: Compose file completo, volumes, health checks

### Áreas de Melhoria 🔧

#### **Backend**

1. **Testes Automatizados**
   - Atualmente: `npm test` retorna "No tests yet"
   - Sugestão: Adicionar testes com Jest + supertest
   - Casos críticos: Login, registo, recomendações, filtros

2. **Validação Robusta**
   - Input validation: Usar bibliotecas como `joi` ou `yup`
   - Exemplo: Validar `score` no POST `/ratings` (1-5)

3. **Rate Limiting**
   - Proteger endpoints contra abuse (ex: login brute force)
   - Usar `express-rate-limit`

4. **Logging & Observabilidade**
   - Passar de `console.log` para logger estruturado (Winston, Pino)
   - Adicionar rastreamento de erros (Sentry)

5. **Paginação & Performance**
   - Queries complexas (recomendações) podem ser lentas com muitos dados
   - Considerar cache (Redis)
   - Otimizar índices

6. **Documentação da API**
   - Adicionar Swagger/OpenAPI
   - Exemplos cURL, Postman collection

#### **Frontend**

1. **Testes**
   - Adicionar testes com Vitest + React Testing Library
   - Cobrir componentes críticos (Login, Movies, Recommendations)

2. **Tratamento de Erros**
   - UI melhorada para erros de rede
   - Retry automático para requisições falhadas

3. **Performance**
   - Code splitting de rotas
   - Lazy loading de páginas
   - Otimizar bundle (atual ~100KB+ minificado)

4. **Acessibilidade**
   - ARIA labels
   - Navegação por teclado

5. **PWA (Progressive Web App)**
   - Service Worker para offline
   - Instalável no home screen

#### **DevOps**

1. **CI/CD Completo**
   - ✅ Testes executam
   - 🔧 Adicionar Docker build & push
   - 🔧 Deploy automático (staging + production)
   - 🔧 Análise de segurança (Snyk, trivy)

2. **Secrets Management**
   - Usar GitHub Secrets para JWT_SECRET, credenciais BD
   - Nunca commitar `.env`

3. **Database Migrations**
   - Versionamento de schema
   - Ferramentas: Flyway, Liquibase

4. **Monitoring & Alertas**
   - Métricas (Prometheus)
   - Alertas (Alertmanager, PagerDuty)

#### **Segurança Geral**

1. **HTTPS/TLS**: Usar em produção
2. **CORS**: Atualmente `*` localmente, restringir em produção
3. **SQL Injection**: ✅ Protegido com parameterização
4. **XSS**: ✅ React automático escapa valores
5. **CSRF**: Não implementado; considerar tokens CSRF se usar cookies
6. **Dependências**: Manter atualizadas; usar `npm audit`

---

## Conclusão

O **ASE Movie Recommender** é uma aplicação funcional e bem-estruturada que demonstra:
- Implementação correcta de autenticação JWT
- Design de API RESTful coerente
- Frontend responsivo e intuitivo
- Pipeline CI/CD em construção

Para produção, recomenda-se:
1. Adicionar testes automatizados (alta prioridade)
2. Implementar logging estruturado e observabilidade
3. Completar pipeline CI/CD com deploy automático
4. Reforçar validação de inputs e tratamento de erros
5. Otimizar performance de queries complexas

A base está sólida para evolução contínua.

---

**Anexos**:
- `docker-compose.yml` — Orquestração local
- `PLANO.md` — Roadmap do projeto
- `README.md` — Guia de quick start
