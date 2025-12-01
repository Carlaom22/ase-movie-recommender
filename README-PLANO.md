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
│   ├── routes/             ✅ Estrutura criada
│   │   ├── auth.js         ⚠️  Placeholder
│   │   ├── movies.js       ⚠️  Placeholder
│   │   ├── ratings.js      ⚠️  Placeholder
│   │   ├── recommendations.js ⚠️ Placeholder
│   │   └── users.js        ⚠️  Placeholder
│   ├── Dockerfile          ✅ Configurado
│   └── package.json        ✅ Dependências base
├── frontend/               ✅ Estruturado
│   ├── src/
│   │   ├── App.jsx         ✅ Router básico
│   │   └── pages/          ✅ Componentes criados
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
| **RF1** | Registo e autenticação de utilizadores | ❌ **Crítico** | 🔴 Alta |
| **RF2** | Pesquisa no catálogo de livros e filmes | ❌ **Crítico** | 🔴 Alta |
| **RF3** | Filtragem e ordenação de resultados | ❌ **Crítico** | 🔴 Alta |
| **RF4** | Visualização de detalhes do item | ❌ **Crítico** | 🔴 Alta |
| **RF5** | Atribuição de ratings de 1 a 5 estrelas | ❌ **Crítico** | 🔴 Alta |
| **RF6** | Geração de recomendações personalizadas | ❌ **Crítico** | 🟡 Média |
| **RF7** | Consulta de perfil do utilizador | ❌ **Importante** | 🟡 Média |
| **RF8** | Endpoints /health e /metrics | ❌ **Importante** | 🟢 Baixa |

### ❌ **Requisitos Não Funcionais**
- [ ] **Testes automatizados** (cobertura ≥ 50%)
- [ ] **Segurança** (HTTPS, JWT, hashing seguro)
- [ ] **Performance** (< 2s resposta p95)
- [ ] **Documentação** completa da API

---

## 📅 **CRONOGRAMA DE EXECUÇÃO (11 DIAS)**

### **🔥 FASE 1: AUTENTICAÇÃO E SEGURANÇA (2-3 Dezembro)**
**Objetivo:** Implementar RF1 completamente

#### **Backend - Autenticação**
- [ ] Instalar dependências: `bcryptjs`, `jsonwebtoken`
- [ ] Implementar hash de passwords com bcrypt
- [ ] Criar middleware de autenticação JWT
- [ ] Endpoints completos:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me`

#### **Frontend - Autenticação**
- [ ] Context/Hook de autenticação
- [ ] Formulários de login/registo funcionais
- [ ] Proteção de rotas privadas
- [ ] Gestão de tokens no localStorage

#### **Validação**
- [ ] Registo de novos utilizadores funcional
- [ ] Login com validação de credenciais
- [ ] Proteção de rotas sensíveis
- [ ] Gestão de sessões

---

### **🎬 FASE 2: CATÁLOGO E NAVEGAÇÃO (4-5 Dezembro)**
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

### **⭐ FASE 3: RATINGS E RECOMENDAÇÕES (6-7 Dezembro)**
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

### **👤 FASE 4: PERFIL E MONITORIZAÇÃO (8-9 Dezembro)**
**Objetivo:** Implementar RF7, RF8

#### **Backend - Perfil e Monitorização**
- [ ] Endpoints de perfil:
  - `GET /users/profile` (dados do utilizador)
  - `PUT /users/profile` (editar perfil)
  - `GET /users/ratings` (histórico de avaliações)
- [ ] Endpoints de monitorização:
  - `GET /health` (estado do sistema)
  - `GET /metrics` (métricas de performance)

#### **Frontend - Perfil do Utilizador**
- [ ] Página de perfil completa
- [ ] Histórico de avaliações
- [ ] Edição de dados pessoais
- [ ] Estatísticas pessoais

#### **Validação**
- [ ] Perfil editável funcional
- [ ] Histórico de avaliações correto
- [ ] Endpoints de monitorização ativos

---

### **🚀 FASE 5: FINALIZAÇÃO E ENTREGA (10-12 Dezembro)**

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
| **Implementação dos RF** | 100% dos RF do MVP | ❌ 0% |
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

- **Progresso Geral:** 25% (Infraestrutura completa)
- **RF Implementados:** 0/8 (0%)
- **Testes:** 0% cobertura
- **Documentação:** 30% (requisitos + arquitetura)

---

## 🔄 **PRÓXIMOS PASSOS IMEDIATOS**

1. **HOJE (1 Dez):** Começar implementação da autenticação JWT
2. **Amanhã (2 Dez):** Finalizar backend de autenticação
3. **3 Dez:** Implementar frontend de autenticação
4. **4 Dez:** Iniciar desenvolvimento do catálogo

---

**⚡ FOCO:** Implementar um RF por dia para garantir MVP funcional até 12 de Dezembro.

**🎯 META:** Sistema funcional com todos os RF básicos implementados e 50% de cobertura de testes.