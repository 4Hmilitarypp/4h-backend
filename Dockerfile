FROM node:alpine AS build

ARG DATABASE_URL
ARG EMAIL_USER
ARG EMAIL_PASS
ARG CAPTCHA_SECRET

ENV DATABASE_URL=$DATABASE_URL \
		EMAIL_USER=$EMAIL_USER \
		EMAIL_PASS=$EMAIL_PASS \
		CAPTCHA_SECRET=$CAPTCHA_SECRET \
		REACT_APP_API_URL=/api \
		FRONTEND_URL=https://4h.wendte.tech

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "production"]