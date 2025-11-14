FROM node:20-alpine

# Pasta de trabalho dentro do container
WORKDIR /app

# Copiar apenas package.json e package-lock.json primeiro (melhor cache)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o resto do código
COPY . .

# Porta exposta pelo backend
EXPOSE 3000

# Comando de arranque
CMD ["node", "index.js"]
