FROM node:12.22.0-alpine3.11

WORKDIR /home/math-expression-evaluator
COPY . .
RUN npm i