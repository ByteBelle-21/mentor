FROM node:14
WORKDIR /app
COPY package*.json  ./
RUN npm install cors
RUN npm install mysql2
RUN npm install express
RUN npm install body-parser
RUN npm install multer
COPY . . 
EXPOSE 4000
CMD ["node", "server.js"]