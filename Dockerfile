FROM node:7.0.0
COPY package.json /package.json

RUN npm install

COPY app /app

ENTRYPOINT ["node", "/app/app.js"]