FROM node:18-alpine3.18
RUN mkdir -p /Chatbot/node_modules && chown -R node:node /Chatbot/
WORKDIR /Chatbot
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 9000
CMD ["node", 'server.js']