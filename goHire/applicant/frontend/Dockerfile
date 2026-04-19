FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=optional \
	&& npm install --no-save @rollup/rollup-linux-x64-gnu lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu \
	&& npm cache clean --force

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
