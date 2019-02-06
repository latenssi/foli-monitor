FROM node:current-alpine as build

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html