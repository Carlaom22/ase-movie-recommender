# 📋 PLANO DE EXECUÇÃO - Sistema de Recomendação de Filmes/Livros
**Projeto ASE 2025/2026 - Meta 3 (M3)**  
**Deadline: 12 de Dezembro de 2025**  
**Dias restantes: 11 dias**

---

## 🎯 **ESTADO ATUAL DO PROJETO**

### ✅ **O QUE JÁ ESTÁ IMPLEMENTADO (M2)**

#### **Infraestrutura e Arquitetura**
- [x] **Estrutura de projeto** organizada (frontend + backend + database)
- [x] **Docker Compose** funcional com PostgreSQL
- [x] **CI/CD Pipeline** via GitHub Actions
- [x] **Base de dados** com schema completo:
  - Tabelas: `users`, `movies`, `ratings`, `recommendations`
  - Índices otimizados
  - Dados de exemplo inseridos
- [x] **Backend Express.js** com estrutura de rotas
- [x] **Frontend React + Vite** com React Router
- [x] **Configuração CORS** e middlewares básicos

#### **Estrutura de Código**
```
ase-movie-recommender/
├── backend/                 ✅ Estruturado
│   ├── index.js            ✅ Servidor principal
│   ├── db.js               ✅ Conexão BD
│   ├── middleware/         ✅ Middleware de autenticação
│   │   └── auth.js         ✅ JWT middleware implementado
│   ├── utils/              ✅ Utilitários de segurança
│   │   └── auth.js         ✅ Hash, tokens, validações
│   ├── routes/             ✅ Estrutura criada
│   │   ├── auth.js         ✅ COMPLETO - 4 endpoints funcionais
│   │   ├── movies.js       ⚠️  Placeholder
│   │   ├── ratings.js      ⚠️  Placeholder
│   │   ├── recommendations.js ⚠️ Placeholder
│   │   └── users.js        ⚠️  Placeholder
│   ├── Dockerfile          ✅ Configurado
│   └── package.json        ✅ Dependências + bcryptjs + JWT
├── frontend/               ✅ Estruturado
│   ├── src/
│   │   ├── App.jsx         ✅ Router + AuthProvider + proteção
│   │   ├── services/       ✅ API service com interceptadores
│   │   │   └── api.js      ✅ Axios + JWT + tratamento 401
│   │   ├── contexts/       ✅ Context de autenticação
│   │   │   └── AuthContext.jsx ✅ Estado global completo
│   │   ├── hooks/          ✅ Hook personalizado
│   │   │   └── useAuth.js  ✅ Wrapper do context
│   │   ├── components/     ✅ Proteção de rotas
│   │   │   └── ProtectedRoute.jsx ✅ Redirecionamento
│   │   └── pages/          ✅ Componentes integrados
│   │       ├── Login.jsx   ✅ Formulário funcional
│   │       ├── Register.jsx ✅ Formulário funcional
│   │       └── Profile.jsx ✅ Dados do utilizador
│   └── package.json        ✅ React + Vite
├── database/
│   └── init.sql            ✅ Schema completo
├── docker-compose.yml      ✅ Configuração completa
└── .github/workflows/      ✅ CI/CD funcional
```

---

## 🚨 **O QUE FALTA IMPLEMENTAR (CRÍTICO)**

### ❌ **Requisitos Funcionais - Lógica de Negócio**

| ID | Requisito | Status | Prioridade |
|---|-----------|--------|------------|
| **RF1** | Registo e autenticação de utilizadores | ✅ **COMPLETO** | 🔴 Alta |
| **RF2** | Pesquisa no catálogo de livros e filmes | ❌ **Crítico** | 🔴 Alta |
| **RF3** | Filtragem e ordenação de resultados | ❌ **Crítico** | 🔴 Alta |
| **RF4** | Visualização de detalhes do item | ❌ **Crítico** | 🔴 Alta |
| **RF5** | Atribuição de ratings de 1 a 5 estrelas | ❌ **Crítico** | 🔴 Alta |
| **RF6** | Geração de recomendações personalizadas | ❌ **Crítico** | 🟡 Média |
| **RF7** | Consulta de perfil do utilizador | ✅ **COMPLETO** | 🟡 Média |
| **RF8** | Endpoints /health e /metrics | ❌ **Importante** | 🟢 Baixa |

### ❌ **Requisitos Não Funcionais**
- [ ] **Testes automatizados** (cobertura ≥ 50%)
- [ ] **Segurança** (HTTPS, JWT, hashing seguro)
- [ ] **Performance** (< 2s resposta p95)
- [ ] **Documentação** completa da API

---

## 📅 **CRONOGRAMA DE EXECUÇÃO (11 DIAS)**

### **🔥 FASE 1: AUTENTICAÇÃO E SEGURANÇA (2-5 Dezembro) ✅ COMPLETA**
**Objetivo:** Implementar RF1 completamente

#### **Backend - Autenticação ✅**
- [x] Instalar dependências: `bcryptjs`, `jsonwebtoken`
- [x] Implementar hash de passwords com bcrypt (salt rounds: 12)
- [x] Criar middleware de autenticação JWT
- [x] Endpoints completos:
  - `POST /auth/register` ✅ Funcional com validações
  - `POST /auth/login` ✅ Funcional com verificação
  - `POST /auth/logout` ✅ Funcional
  - `GET /auth/me` ✅ Funcional

#### **Frontend - Autenticação ✅**
- [x] Context/Hook de autenticação completo
- [x] Formulários de login/registo funcionais
- [x] Proteção de rotas privadas (ProtectedRoute)
- [x] Gestão de tokens no localStorage
- [x] Navegação condicional baseada no estado de auth
- [x] Tratamento automático de erros 401

#### **Validação ✅**
- [x] Registo de novos utilizadores funcional
- [x] Login com validação de credenciais
- [x] Proteção de rotas sensíveis (todas exceto login/register)
- [x] Gestão de sessões e logout automático
- [x] Persistência após refresh da página

---

### **🎬 FASE 2: CATÁLOGO E NAVEGAÇÃO (6-7 Dezembro) 🔄 ATUAL**
**Objetivo:** Implementar RF2, RF3, RF4

#### **Backend - Gestão de Filmes**
- [ ] CRUD completo de filmes:
  - `GET /movies` (pesquisa, paginação, filtros)
  - `GET /movies/:id` (detalhes completos)
  - `POST /movies` (adicionar - admin)
  - `PUT /movies/:id` (editar - admin)
  - `DELETE /movies/:id` (remover - admin)

#### **Frontend - Interface de Catálogo**
- [ ] Página principal com lista de filmes
- [ ] Componente de pesquisa funcional
- [ ] Filtros por género, ano, popularidade
- [ ] Página de detalhes do filme
- [ ] Paginação de resultados

#### **Validação**
- [ ] Pesquisa por título funcional
- [ ] Filtros aplicados corretamente
- [ ] Detalhes exibidos completamente
- [ ] Performance adequada (< 2s)

---

### **⭐ FASE 3: RATINGS E RECOMENDAÇÕES (8-9 Dezembro)**
**Objetivo:** Implementar RF5, RF6

#### **Backend - Sistema de Avaliações**
- [ ] Endpoints de ratings:
  - `POST /ratings` (criar/atualizar avaliação)
  - `GET /ratings/user/:id` (avaliações do utilizador)
  - `GET /ratings/movie/:id` (avaliações do filme)
  - `DELETE /ratings/:id` (remover avaliação)

#### **Backend - Engine de Recomendações**
- [ ] Algoritmo básico de recomendações:
  - Collaborative filtering simples
  - Fallback por popularidade
  - Cache de recomendações
- [ ] Endpoints:
  - `GET /recommendations/:userId` (recomendações personalizadas)
  - `GET /recommendations/popular` (trending)

#### **Frontend - Ratings e Recomendações**
- [ ] Componente de rating (1-5 estrelas)
- [ ] Página de recomendações personalizadas
- [ ] Exibição de médias de avaliação
- [ ] Histórico de avaliações do utilizador

#### **Validação**
- [ ] Avaliações guardadas corretamente
- [ ] Médias calculadas automaticamente
- [ ] Recomendações geradas e exibidas
- [ ] Interface intuitiva de rating

---

### **👤 FASE 4: PERFIL E MONITORIZAÇÃO (10-11 Dezembro)**
**Objetivo:** Completar RF8 (RF7 já está implementado)

#### **Backend - Monitorização**
- [ ] Endpoints de monitorização:
  - `GET /health` (estado do sistema)
  - `GET /metrics` (métricas de performance)

#### **Validação**
- [ ] Endpoints de monitorização ativos

---

### **🚀 FASE 5: FINALIZAÇÃO E ENTREGA (12 Dezembro)**

#### **Testes e Qualidade**
- [ ] Testes unitários (backend)
- [ ] Testes de integração
- [ ] Cobertura de código ≥ 50%
- [ ] Validação de todos os RF

#### **Documentação e Apresentação**
- [ ] Documentação completa da API
- [ ] README atualizado com instruções
- [ ] Comparação "Tradicional vs IA"
- [ ] Slides de apresentação
- [ ] Demonstração em vídeo

#### **Deploy e Validação Final**
- [ ] Deploy em produção (Docker)
- [ ] Validação dos critérios MVP
- [ ] Testes de performance
- [ ] Backup da base de dados

---

## 🎯 **CRITÉRIOS DE ACEITAÇÃO MVP**

| Critério | Meta | Status |
|----------|------|--------|
| **Implementação dos RF** | 100% dos RF do MVP | 🟡 25% (2/8 RF completos) |
| **Tempo de resposta** | < 2s em 95% dos pedidos | ❌ N/A |
| **Pipeline CI/CD** | Build + testes automáticos | ✅ Funcional |
| **Cobertura de testes** | ≥ 50% | ❌ 0% |
| **Disponibilidade** | 95% uptime | ❌ N/A |

---

## ⚠️ **RISCOS E MITIGAÇÕES**

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| **Tempo insuficiente** | Alto | Alta | Priorizar RF críticos, MVP mínimo |
| **Complexidade algoritmo recomendações** | Médio | Média | Usar algoritmo simples, otimizar depois |
| **Problemas de integração** | Alto | Baixa | Testes contínuos, deploy incremental |
| **Falta de testes** | Médio | Alta | Implementar testes durante desenvolvimento |

---

## 📊 **MÉTRICAS DE PROGRESSO**

- **Progresso Geral:** 50% (Infraestrutura + Autenticação completa)
- **RF Implementados:** 2/8 (25% - RF1 e RF7 completos)
- **Testes:** 0% cobertura
- **Documentação:** 60% (requisitos + arquitetura + autenticação)

## ✅ **CONQUISTAS DESDE ÚLTIMA ATUALIZAÇÃO**

### **RF1 - Autenticação Completa ✅**
- Backend: 4 endpoints JWT funcionais com segurança bcrypt
- Frontend: Context, hooks, proteção de rotas, formulários integrados
- Funcionalidades: Registo, login, logout, proteção automática, persistência

### **RF7 - Perfil do Utilizador ✅**  
- Página de perfil funcional
- Exibição de dados do utilizador autenticado
- Funcionalidade de logout integrada

---

## 🔄 **PRÓXIMOS PASSOS IMEDIATOS**

1. **HOJE (5 Dez):** Iniciar implementação do catálogo de filmes (RF2)
2. **AMANHÃ (6 Dez):** Backend completo de filmes + pesquisa
3. **7 Dez:** Frontend do catálogo + filtros + detalhes
4. **8 Dez:** Sistema de ratings (RF5)

---

**⚡ FOCO:** Implementar um RF por dia para garantir MVP funcional até 12 de Dezembro.

**🎯 META:** Sistema funcional com todos os RF básicos implementados e 50% de cobertura de testes.