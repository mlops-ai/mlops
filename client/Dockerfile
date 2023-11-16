FROM node:18.16

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
ENV NODE_OPTIONS="--max_old_space_size=8192"
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host"]