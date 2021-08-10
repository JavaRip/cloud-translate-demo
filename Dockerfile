FROM node:14 as builder
WORKDIR ./
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install --production
COPY ./ ./
ENV PORT 9999
EXPOSE 9999

CMD ["node", "server.js"]
