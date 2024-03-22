FROM node:20.11.1-alpine

WORKDIR /usr/src/app

COPY . .

COPY package*.json .

EXPOSE 4000

RUN npm ci

CMD npx prisma migrate dev && npm run start:dev