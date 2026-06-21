FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npx", "ts-node-dev", "--cache-directory", "/tmp/tsnd-cache", "--respawn", "--transpile-only", "--ignore-watch", "node_modules", "src/index.ts"]
