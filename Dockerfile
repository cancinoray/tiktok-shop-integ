ARG NODE_VERSION=18.13.0

FROM node:${NODE_VERSION}
ENV NODE_ENV production

WORKDIR /app

COPY package.json .

COPY . .

RUN  npm install -g typescript@5.0.4

RUN npm install
RUN npm run build

EXPOSE 8080

# Run the application.
CMD node /app/dist/server.js