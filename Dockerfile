FROM node:18

WORKDIR /Chatbot

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]
