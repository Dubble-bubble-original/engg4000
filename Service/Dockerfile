FROM node:17.4-alpine as alpine

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

EXPOSE 3001

CMD ["npm","run","dev"]
