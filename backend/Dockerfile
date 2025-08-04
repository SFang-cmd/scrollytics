FROM node:20
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start" ]
