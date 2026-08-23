FROM node:20-alpine
WORKDIR /app
ARG BUILD_NUMBER=0
ARG COMMIT_SHA=unknown
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV COMMIT_HASH=${COMMIT_SHA}
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD [ "node", "app.js" ]
