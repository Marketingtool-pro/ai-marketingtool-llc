FROM node:22-slim AS builder
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /workspace/dist ./dist
COPY public/ ./public/
COPY scripts/ ./scripts/
COPY .claude/ /root/.claude/

EXPOSE 8080
CMD ["node", "dist/index.js"]
