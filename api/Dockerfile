FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm ci --only=production
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
