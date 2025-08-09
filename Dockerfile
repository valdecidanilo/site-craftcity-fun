# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: run app
FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos necessários para produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
