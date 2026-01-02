FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY dist ./dist
COPY public ./public

EXPOSE 4000

CMD ["node", "dist/app.js"]
