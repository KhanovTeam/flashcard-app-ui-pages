# -------- STAGE 1: Build --------
FROM node:20 AS build
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# -------- STAGE 2: Nginx --------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker build -t flashcard-ui .
# docker run -p 3000:80 --name flashcard-ui-container flashcard-ui