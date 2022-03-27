FROM node:14.17.0-alpine

WORKDIR /app

COPY . /app
RUN apk add --update alpine-sdk
RUN apk add --no-cache python && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache

COPY package.json .
RUN npm install --no-optional -f
RUN npm install pm2 -g
COPY . .

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
