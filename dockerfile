FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; elif [ \"$NODE_ENV\" = \"test\" ]; then exit 0; else npm run start:dev; fi" ]
