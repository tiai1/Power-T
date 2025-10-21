FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY .next .next
COPY public ./public
COPY app ./app
COPY pages ./pages
RUN npm ci --only=production || true
EXPOSE 3000
CMD ["npm", "start"]
