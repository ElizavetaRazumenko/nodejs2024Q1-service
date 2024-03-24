FROM node:20.11.1-alpine

WORKDIR /usr/src/app

COPY . .

COPY package*.json .

RUN npm install

CMD npx prisma generate && npx prisma migrate deploy && npm run start:dev