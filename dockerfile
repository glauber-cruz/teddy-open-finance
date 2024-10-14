FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; elif [ \"$NODE_ENV\" = \"test\" ]; then npm run test; else npm run start:dev; fi"]
