#
# Copyrights to StackInsights
# All rights are reserved 2019
#

FROM node:12

WORKDIR /app

ADD . /app

RUN npm install request && npm install && npm run build

ADD tests/build/main.ts /test/main.ts
ADD tests/build/package.json /test/package.json

WORKDIR /test

RUN npm install && npm install /app && npm run build
