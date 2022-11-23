FROM node:16

WORKDIR /saig/mepupz/

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run start:migrate:prod
RUN npm run build

CMD [ "node", "run", "start:prod" ]
