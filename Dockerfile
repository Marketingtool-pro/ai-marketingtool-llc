FROM node:22.23.2-alpine3.24 AS builder
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:22.23.2-alpine3.24 AS runtime
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist ./dist
COPY public/ ./public/
COPY scripts/ ./scripts/
COPY .claude/ /root/.claude/

EXPOSE 8080
CMD ["node", "dist/index.js"]
