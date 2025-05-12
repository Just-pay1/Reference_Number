FROM node:24-slim

WORKDIR /app

# Build-time arguments (to be passed from GitHub Actions in `docker build` step)
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASS
ARG DB_NAME
ARG PORT
ARG RABBITMQ_URL
ARG QUEUE_NAME

# Environment variables inside the container
ENV DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_USER=$DB_USER \
    DB_PASS=$DB_PASS \
    DB_NAME=$DB_NAME \
    PORT=$PORT \
    RABBITMQ_URL=$RABBITMQ_URL \
    QUEUE_NAME=$QUEUE_NAME

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]