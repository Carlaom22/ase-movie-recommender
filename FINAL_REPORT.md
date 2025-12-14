**Resumo Executivo**

- **Projeto**: ASE Movie Recommender — sistema de recomendação de filmes com frontend React e backend Node/Express + PostgreSQL.
- **Objetivo**: Implementar uma engine de recomendações (content-based, collaborative, popularity), providenciar UI para avaliação e recomendações, e explorar automação (CI/CD) e o uso de LLMs para acelerar desenvolvimento e polir a interface.
- **Abordagem**: Desenvolvimento tradicional no backend com testes manuais; uso de um agente LLM (Copilot-style) para acelerar e padronizar a implementação da funcionalidade de recomendações e para melhorar a estética do frontend.

**1. Objetivos do Relatório**

- Descrever o que o projeto contém (funcionalidades principais).
- Explicar o processo de desenvolvimento seguido (SDLC aplicado).
- Comparar abordagens: desenvolvimento manual vs. assistido por LLMs (Copilot).
- Documentar práticas DevOps e desenho de uma pipeline CI/CD pretendida.
- Fazer uma análise crítica sobre o uso de LLMs: benefícios, limitações, riscos e recomendações.

**2. Conteúdo e Funcionalidades do Projeto**

- **Backend**
  - API REST em Node/Express com endpoints para autenticação, filmes, ratings, recomendações e usuários.
  - Base de dados PostgreSQL com script `database/init.sql` para schema e seeds (20 filmes).
  - Estratégias de recomendação implementadas: content-based, collaborative filtering e fallback por popularidade.
  - Paginação, filtros e ordenação no endpoint `/movies`.

- **Frontend**
  - SPA React (Vite) com páginas: `Movies`, `Recommendations`, `Profile`, `Register`, `Login`.
  - Componentes reutilizáveis (Rating/Stars, ProtectedRoute, auth context, serviços API).
  - UI polida: grid responsivo, cards, badges, estados de loading/empty/error.

- **Infra & Dev**
  - Docker Compose para orquestração local (DB e serviços), scripts npm para desenvolvimento.

**3. Processo de Desenvolvimento (SDLC aplicado)**

- **Planeamento / Requisitos**: especificações iniciais (ver `ASE_M1_...pdf`) definiram objetivos e endpoints necessários.
- **Design**: esquema da base de dados e contratos API; decisão por 3 estratégias de recomendação e endpoints para refresh e saved.
- **Implementação (iterativa)**: começámos pelo backend — implementar endpoints, queries SQL e testes manuais com Postman/Insomnia.
  - Só quando um endpoint estava estável é que avançávamos para integrar o frontend sobre essa API.
- **Testes**: testes manuais (validação de queries, casos sem ratings, limites de paginação). Criámos também pequenos scripts de teste para validar resultados das estratégias.
- **Refatoração & Estética**: utilizámos a LLM para acelerar geração de helpers, consultas SQL e para refinar o CSS/UX do frontend; a decisão de usar IA para a parte estética foi intencional para ganhar qualidade visual sem comprometer a lógica de negócio.
- **Entrega**: consolidar código, documentar endpoints e preparar recomendações para pipeline CI/CD.

**4. Desenvolvimento da Funcionalidade de Recomendações — Processo Detalhado**

(Adaptado e expandido a partir de `DEVELOPMENT_PROCESS.md`)

- **Abordagem com Copilot (assistida por LLM)**
  - Leitura inicial do código existente, identificação de padrões e sugestão de helpers.
  - Geração rápida de 3 funções auxiliares: `getContentBasedRecommendations()`, `getCollaborativeRecommendations()`, `getPopularityBasedRecommendations()` com queries SQL parameterizadas.
  - Implementação da lógica de combinação (prioridade: content > collaborative > popularity) com deduplicação.
  - Criação de endpoints: `GET /recommendations`, `GET /recommendations/saved`, `POST /recommendations/refresh` com tratamento de erros e logging.
  - Frontend: criação do componente React para listagem de recomendações com estados (loading / empty / error) e cards responsivos.
  - Tempo estimado: ~2–3 horas para a feature completa (código + UI + documentação)

- **Abordagem Manual (estimativa e comparação)**
  - Análise e codificação manual das três estratégias, tuning das queries e testes locais: estimativa ~16–18 horas.
  - Mais tempo investido em escrever docs, CSS responsivo e scripts de teste.

- **Principais ganhos ao usar LLM**
  - Geração de boilerplate e queries bem estruturadas, redução de tempo para criar endpoints e componentes.
  - Produção rápida de CSS e padronização de estilo entre páginas.

- **Principais problemas encontrados com LLM**
  - Sugestões iniciais podiam ignorar contexto completo (ex.: criação de tabelas duplicadas) — exigiu supervisão humana.
  - SQL complexo gerado por IA exigiu simplificação (CTEs, GROUP BY) para evitar erros do Postgres.
  - Erros pequenos de configuração (baseURL) e validações foram resolvidos manualmente.

**5. Comparação Técnica: Manual vs LLM — Resumo**

- **Tempo**: LLM reduziu o tempo de ~16–18h para ~2.5h no caso da feature de recomendações.
- **Qualidade inicial**: O código gerado é idiomático, mas requer revisão humana para casos limítrofes e segurança.
- **Bugs**: Menos bugs iniciais com LLM (mas os que aparecem tendem a ser lógicos ou contextuais, p.ex. SQL sofisticado).
- **Documentação**: LLM acelerou produção de documentação e testes básicos.

**6. Práticas DevOps e CI/CD (aplicadas e recomendadas)**

- **O que foi aplicado durante o projeto**
  - Uso de `docker-compose` para ambientes locais (DB + backend) garantindo repetibilidade.
  - Scripts npm para desenvolvimento e execução local.

- **Recomendações de pipeline CI/CD**
  - **Build**: instalar dependências e executar linter e testes unitários (frontend e backend).
  - **Test**: rodar testes automatizados (backend API tests, scripts de integração simples contra um Postgres em container), e2e para fluxos críticos (login, avaliação, recommendations).
  - **Lint & Static Analysis**: ESLint para frontend, ferramentas para segurança SQL/Node (sql-lint, queries review), Snyk/Dependabot para dependências.
  - **Containerização**: construir imagens Docker do backend e do frontend em CI e publicar em registo (Docker Hub / GitHub Container Registry).
  - **Deploy**: automatizar deploy para ambiente de staging e production (ex.: GitHub Actions → Docker image → Kubernetes/Cloud Run/VMs).
  - **Pipeline exemplo (GitHub Actions)**: workflow que executa `npm ci`, `npm run lint`, `npm test`, `docker build`, `docker push`, e implanta em staging.

- **Pontos de atenção**
  - Testes automáticos devem incluir validação de SQL e cenários com dados edge-case (users sem ratings).
  - Secrets management: usar GitHub Secrets ou Vault para chaves e strings de conexão.

**7. Análise Crítica sobre o Uso de LLMs no Ciclo SDLC**

- **O que funcionou bem**
  - Produtividade: aceleração na geração de boilerplate, helpers e UI.
  - Padronização: estilo consistente em componentes e CSS aplicados rapidamente.
  - Documentação automática: READMEs e guias gerados para endpoints e componentes.

- **Limitações e riscos**
  - Dependência de contexto: sem fornecer ficheiros/constraints completos a LLM pode sugerir código incompatível.
  - Segurança: LLMs não garantem automaticamente práticas de segurança — validação humana é obrigatória.
  - SQL e lógica complexa: pequenas subtilezas (DISTINCT + ORDER BY) podem causar erros; testes são essenciais.

- **Recomendações de governança**
  - Sempre submeter código gerado por LLM a code review e testes automatizados.
  - Ter regras claras para quando usar LLM (boilerplate, CSS, testes), e quando exigir design humano (arquitetura, segurança, modelos de dados).
  - Rastreabilidade: documentar prompts usados para gerar trechos críticos (auditoria).

**8. Avaliação dos Resultados e Métricas**

- **Métricas internas recolhidas (da análise do processo)**
  - **Tempo total** (feature recomendações): ~2.5 horas com Copilot vs ~16–18h manual.
  - **Linhas de código**: similares (~600), porém tempo de produção muito menor com IA.
  - **Bugs detectados**: 1 bug significativo no SQL com Copilot (corrigido rapidamente), múltiplos bugs esperados com abordagem manual.

- **Conclusões quantitativas**
  - Uso de LLMs trouxe grande ganho de produtividade e menor taxa de erros triviais, desde que acompanhado de revisão humana.

**9. Conclusões e Recomendações Finais**

- O uso de LLMs no projeto mostrou-se altamente benéfico para acelerar implementação e melhorar qualidade estética do frontend.
- A nossa estratégia (desenvolver backend manualmente com testes e só depois utilizar LLM para acelerar etapas subsequentes) funcionou bem: manteve controlo sobre a lógica de negócio enquanto aproveitámos IA para produtividade.
- Recomenda-se implementar uma pipeline CI/CD completa antes do deploy em produção, com etapas de lint, testes, análise de segurança e publicação automática das imagens Docker.
- Para governança de IA: definir políticas de revisão, manter prompts e versões dos snippets gerados e realizar auditoria regular do código gerado.

**10. Próximos Passos (curto/médio prazo)**

- Implementar workflows CI com GitHub Actions conforme as recomendações.
- Adicionar testes automatizados (unit + integração) para endpoints críticos e para as três estratégias de recomendação.
- Documentar prompts e exemplos de uso do Copilot em `copilot-instructions.md` (já parcialmente criado).
- Automatizar geração de relatórios de qualidade (lint, cobertura de testes) em cada PR.

**11. Apêndices**

- `DEVELOPMENT_PROCESS.md` — Análise detalhada do desenvolvimento da funcionalidade de recomendações (comparação COM/SEM Copilot). (ver anexo no repositório)
- `ASE_M1_...pdf` — Especificações iniciais e requisitos do projeto.
- `FINAL_REPORT.md` — Este ficheiro.

---

Referências internas:
- Ficheiros relevantes: `database/init.sql`, `backend/routes/recommendations.js`, `frontend/src/pages/Recommendations.jsx`, `frontend/src/pages/Register_NEW.jsx`, `DEVELOPMENT_PROCESS.md`.


---

Se queres, converto isto para PDF ou adiciono um sumário executivo em inglês e uma secção com exemplos de GitHub Actions (workflow YAML) e commands para executar localmente.
