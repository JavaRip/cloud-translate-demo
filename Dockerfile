FROM node:14 as builder
WORKDIR ./
ENV PORT 9999
EXPOSE 9999
COPY ./ ./
RUN npm install --production

CMD ["node", "server.js"]
