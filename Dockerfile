FROM node:19-alpine3.17

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 6250

EXPOSE 6251

ENV PORT 6250

CMD ["node", "app.js"]