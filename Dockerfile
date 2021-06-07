FROM node:12.21

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env.local ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build 

CMD ["npm","start"]