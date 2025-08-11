FROM node:22.17-alpine

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run db:deploy && npm run start:prod"]