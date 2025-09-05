FROM docker.io/library/node:20-slim

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y tzdata openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm build

ENV HOST=0.0.0.0 PORT=3000 TZ="Asia/Jakarta"

EXPOSE ${PORT}
CMD ["node", "dist/src/main.js"]