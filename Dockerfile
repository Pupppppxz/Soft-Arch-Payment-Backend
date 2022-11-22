FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run start:migrate:prod
RUN npm run build

CMD [ "node", "run", "start:prod" ]