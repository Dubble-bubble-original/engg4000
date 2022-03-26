FROM node:14.17.0-alpine

WORKDIR /app

RUN apk add --no-cache python && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache
RUN apk add --update alpine-sdk

COPY package.json .
RUN npm install node-gyp
RUN npm install
RUN npm install pm2 -g

EXPOSE 3001

CMD ["pm2-runtime", "app.js"]
