ASE Movie Recommender – Bernardo, Bruno, Carlos, Lucas, Miguel

Projeto desenvolvido no âmbito da UC **ASE – Automated Software Engineering**.

A Meta 2 (M2) exige que o repositório tenha:
- Estrutura de frontend + backend organizada
- Docker Compose funcional
- Workflow CI/CD com GitHub Actions já a correr automaticamente
- Código versionado corretamente

Este README documenta tudo isso.

---

# 📁 Estrutura do Projeto
```
ase-movie-recommender/
├── backend/
│ ├── index.js 
│ ├── db.js 
│ ├── routes/ 
│ │ ├── auth.js
│ │ ├── movies.js
│ │ ├── ratings.js
│ │ ├── recommendations.js
│ │ └── users.js
│ ├── Dockerfile
│ ├── package.json
│ ├── package-lock.json
│ └── .env 
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── pages/ 
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Movies.jsx
│ │ │ ├── Recommendations.jsx
│ │ │ └── Profile.jsx
│ ├── package.json
│ ├── package-lock.json
│ └── vite.config.js
│
├── database/
│ └── init.sql 
│
├── docker-compose.yml 
│
├── .github/
│ └── workflows/
│ └── ci.yml
│
├── .env.example
└── README.md
```
---

# Como correr o projeto localmente

## Pré-requisitos

- Node.js v18 ou superior  
- Docker Desktop instalado (e a correr)  
- Git instalado  

---

# Base de Dados — via Docker

Na raiz do projeto:

```bash
docker compose up db
````

Isto irá:

* puxar a imagem do Postgres
* arrancar a base de dados em `localhost:5432`
* criar tabelas via `database/init.sql`

---

# Backend – Node.js + Express

### Instalar dependências:

```bash
cd backend
npm install
```

### Criar o `.env` (baseado em `.env.example`):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=movies
PORT=3000
```

### Iniciar o backend:

```bash
npm start
```

Backend disponível em:

[http://localhost:3000](http://localhost:3000)

Rotas de teste:

* `/auth/test`
* `/users/test`
* `/movies/test`
* `/ratings/test`
* `/recommendations/test`

---

# Frontend – React + Vite

### Instalar dependências:

```bash
cd frontend
npm install
```

### Iniciar o frontend:

```bash
npm run dev
```

Aparece normalmente em:

[http://localhost:5173](http://localhost:5173)

---

# Correr tudo em simultâneo (Frontend + Backend + DB)

Terminais separados:

```bash
docker compose up db
```

```bash
cd backend
npm start
```

```bash
cd frontend
npm run dev
```

Depois abre o browser → página inicial do React.

---

# CI/CD – GitHub Actions (M2)

A pipeline CI está definida em:

```
.github/workflows/ci.yml
```

O workflow realiza:

### **Backend CI**

* Instala dependências (`npm ci`)
* Validação do backend
* Build futuro (placeholder para M3)
* Testes futuros

### **Frontend CI**

* Instala dependências (`npm ci`)
* Build do Vite
* Verificação de erros de compilação

### **Triggers**

O workflow corre automaticamente em:

* `push` para `main`
* `pull_request` para `main`

### **Objetivo da M2**

* Código organizado
* Build funcional para backend e frontend
* Repositório limpo e sem `node_modules`
* CI a correr automaticamente no GitHub

---

# Estado Atual do Projeto (M2)

* [x] Backend estruturado com Express
* [x] Frontend estruturado com React + Vite
* [x] Docker Compose com Postgres funcional
* [x] Estrutura de rotas criada
* [x] Workflow CI/CD via GitHub Actions
* [x] Repositório limpo, sem `node_modules`
* [x] Actions a correr corretamente após push
* [x] Meta 2 cumprida

---

# 👥 Autores

* **Bernardo**
* **Bruno**
* **Carlos**
* **Lucas**
* **Miguel**
