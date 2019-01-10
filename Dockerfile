FROM node:alpine AS build

ARG REACT_APP_API_URL
ARG DATABASE_URL
ARG FRONTEND_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV DATABASE_URL=$DATABASE_URL
ENV FRONTEND_URL=$FRONTEND_URL

WORKDIR /app/
COPY package*.json ./
RUN npm install
COPY . .
RUN CI=true npm run coverage
RUN npm run build
CMD ["npm", "run", "production"]