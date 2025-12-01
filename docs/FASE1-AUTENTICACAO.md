# 🔐 FASE 1: AUTENTICAÇÃO JWT - Documentação Técnica

**Data de Implementação:** 1 de Dezembro de 2025  
**Requisito Funcional:** RF1 - Registo e autenticação de utilizadores  
**Status:** ✅ **IMPLEMENTADO**

---

## 📋 **RESUMO EXECUTIVO**

Esta fase implementa um sistema completo de autenticação baseado em **JWT (JSON Web Tokens)** com as melhores práticas de segurança. O sistema permite registo de novos utilizadores, autenticação segura, gestão de sessões e proteção de rotas.

### **🎯 Objetivos Alcançados:**
- ✅ Registo de utilizadores com validação robusta
- ✅ Autenticação segura com JWT
- ✅ Hash seguro de passwords com bcrypt
- ✅ Middleware de proteção de rotas
- ✅ Gestão de sessões e logout
- ✅ Validações de entrada e tratamento de erros

---

## 🏗️ **ARQUITETURA IMPLEMENTADA**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Base de       │
│                 │    │                  │    │   Dados         │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │   Login     │◄┼────┤ │ Auth Routes  │ │    │ │   users     │ │
│ │   Register  │ │    │ │              │◄┼────┤ │   table     │ │
│ │   Logout    │ │    │ │ Middleware   │ │    │ │             │ │
│ └─────────────┘ │    │ │ JWT Utils    │ │    │ └─────────────┘ │
└─────────────────┘    │ └──────────────┘ │    └─────────────────┘
                       └──────────────────┘
```

---

## 📁 **ESTRUTURA DE FICHEIROS CRIADOS**

```
backend/
├── middleware/
│   └── auth.js              ✅ Middleware JWT + autenticação
├── utils/
│   └── auth.js              ✅ Utilitários de segurança
├── routes/
│   └── auth.js              ✅ Endpoints de autenticação
└── package.json             ✅ Novas dependências
```

---

## 🔧 **DEPENDÊNCIAS ADICIONADAS**

```json
{
  "bcryptjs": "^2.4.3",        // Hash seguro de passwords
  "jsonwebtoken": "^9.0.2"     // Gestão de JWT tokens
}
```

---

## 🌐 **ENDPOINTS IMPLEMENTADOS**

### **POST /auth/register**
**Descrição:** Regista um novo utilizador no sistema  
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com", 
  "password": "minhaPassword123"
}
```

**Response (201 - Sucesso):**
```json
{
  "success": true,
  "message": "Utilizador registado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "created_at": "2025-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validações Implementadas:**
- Nome, email e password obrigatórios
- Formato de email válido
- Password com pelo menos 6 caracteres
- Password deve conter letra e número
- Email único no sistema

---

### **POST /auth/login**
**Descrição:** Autentica um utilizador existente  
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "minhaPassword123"
}
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Login efetuado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva", 
      "email": "joao@exemplo.com",
      "created_at": "2025-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **GET /auth/me**
**Descrição:** Obter dados do utilizador autenticado  
**Autenticação:** ✅ Requerida (Bearer Token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com", 
      "created_at": "2025-12-01T10:00:00.000Z"
    }
  }
}
```

---

### **POST /auth/logout**
**Descrição:** Termina a sessão do utilizador  
**Autenticação:** ✅ Requerida (Bearer Token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 - Sucesso):**
```json
{
  "success": true,
  "message": "Logout efetuado com sucesso"
}
```

---

## 🔒 **IMPLEMENTAÇÃO DE SEGURANÇA**

### **1. Hash de Passwords**
```javascript
// Utilização de bcrypt com salt rounds elevados (12)
const saltRounds = 12;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

### **2. Validação de Passwords**
- **Comprimento mínimo:** 6 caracteres
- **Comprimento máximo:** 128 caracteres
- **Complexidade:** Pelo menos uma letra e um número
- **Sanitização:** Trim e validação de caracteres

### **3. JWT Configuration**
```javascript
{
  expiresIn: '24h',           // Expiração em 24 horas
  issuer: 'ase-movie-recommender',
  audience: 'ase-users'
}
```

### **4. Middleware de Proteção**
- Verificação de token em header Authorization
- Validação de formato Bearer Token
- Verificação de expiração
- Busca de utilizador atualizado na BD

---

## ⚡ **UTILITÁRIOS IMPLEMENTADOS**

### **auth.js (Utils)**
| Função | Descrição |
|--------|-----------|
| `hashPassword()` | Gera hash seguro da password |
| `verifyPassword()` | Verifica password contra hash |
| `generateToken()` | Cria JWT para utilizador |
| `isValidEmail()` | Valida formato de email |
| `validatePassword()` | Valida força da password |
| `sanitizeUser()` | Remove dados sensíveis |

### **auth.js (Middleware)**
| Middleware | Descrição |
|------------|-----------|
| `authenticateToken` | Protege rotas (obrigatório) |
| `optionalAuth` | Autenticação opcional |

---

## 🧪 **TESTES E VALIDAÇÃO**

### **Cenários Testados:**

#### ✅ **Registo Válido**
- Dados corretos → Utilizador criado + Token retornado
- Password hasheada corretamente
- Email único verificado

#### ✅ **Registo Inválido**
- Email duplicado → Erro 409
- Password fraca → Erro 400 
- Email inválido → Erro 400
- Dados em falta → Erro 400

#### ✅ **Login Válido**
- Credenciais corretas → Token retornado
- Password verificada com hash

#### ✅ **Login Inválido**
- Email inexistente → Erro 401
- Password incorreta → Erro 401
- Dados em falta → Erro 400

#### ✅ **Proteção de Rotas**
- Token válido → Acesso permitido
- Token inválido → Erro 401
- Token expirado → Erro 401
- Sem token → Erro 401

---

## 🔧 **CONFIGURAÇÃO NECESSÁRIA**

### **Variáveis de Ambiente (.env)**
```env
# Autenticação JWT (OBRIGATÓRIO)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h
```

### **Base de Dados**
A tabela `users` já existe com a estrutura necessária:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📊 **MÉTRICAS DE QUALIDADE**

| Métrica | Valor | Status |
|---------|-------|--------|
| **Cobertura de Código** | A implementar | 🟡 |
| **Endpoints Funcionais** | 4/4 (100%) | ✅ |
| **Validações** | 8/8 implementadas | ✅ |
| **Tratamento de Erros** | Completo | ✅ |
| **Segurança** | Hash + JWT | ✅ |

---

## 🚀 **COMO USAR**

### **1. Configurar Ambiente**
```bash
cd backend
npm install
cp .env.example .env
# Configurar JWT_SECRET no .env
```

### **2. Testar Endpoints**

**Registo:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com", 
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "password123"
  }'
```

**Perfil (com token):**
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## ⚠️ **CONSIDERAÇÕES DE SEGURANÇA**

### **✅ Implementado:**
- Hash seguro de passwords (bcrypt, 12 rounds)
- JWT com expiração configurável
- Validação rigorosa de entrada
- Sanitização de dados de saída
- Tratamento seguro de erros

### **🔜 Próximas Melhorias:**
- Rate limiting para tentativas de login
- Blacklist de tokens revogados
- Refresh tokens para sessões longas
- Auditoria de tentativas de login
- Verificação de email por confirmação

---

## 🎯 **PRÓXIMOS PASSOS (FASE 2)**

A autenticação está **100% implementada e funcional**. O sistema está preparado para:

1. **Proteger rotas** da gestão de filmes
2. **Associar ratings** a utilizadores autenticados  
3. **Personalizar recomendações** por utilizador
4. **Gerir perfis** de utilizador

A **Fase 2** pode começar implementando o catálogo de filmes usando o middleware `authenticateToken` nas rotas que necessitam de autenticação.

---

**🏆 RF1 (Autenticação) - STATUS: COMPLETO ✅**