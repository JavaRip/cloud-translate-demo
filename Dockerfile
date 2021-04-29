FROM node:14 as builder
WORKDIR ./
ENV PORT 9999
COPY ./package.json ./package.json
RUN npm install --production
COPY ./ ./

CMD ["node", "script.js"]
EXPOSE 9999
