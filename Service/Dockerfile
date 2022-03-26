FROM node:14.17.0-buster-slim

COPY . .

RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev 

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install pm2 -g

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
