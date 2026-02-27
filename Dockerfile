# ========== 开发阶段 ==========
FROM node:20-alpine AS dev

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
# 源码通过 volume 挂载，不在此 COPY
EXPOSE 3000
ENV DOCKER=true
CMD ["npm", "run", "dev"]

# ========== 生产构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ========== 生产运行 ==========
FROM node:20-alpine AS prod

WORKDIR /app
ENV NODE_ENV=production
ENV DOCKER=true

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
