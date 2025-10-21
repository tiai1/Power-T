FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm ci --only=production || true
EXPOSE 4000
CMD ["npm", "start"]
