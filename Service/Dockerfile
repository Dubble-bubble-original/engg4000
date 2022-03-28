FROM node:14.17.0-buster-slim

WORKDIR /app

COPY . .

RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev 

RUN npm install --no-optional -f
RUN npm install pm2 -g

COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
