  <<<<<<< snyk-fix-49c3b7defdf21129b11773970944808e
FROM node:12.22.0-alpine3.11
  =======
FROM node:12-alpine3.11
  >>>>>>> master

WORKDIR /home/math-expression-evaluator
COPY . .
RUN npm i