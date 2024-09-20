
FROM node:20.12.2 AS build
WORKDIR /app
COPY Frontend/milvusui_client/package.json Frontend/milvusui_client/package-lock.json ./
RUN npm install
COPY Frontend/milvusui_client ./
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./Deployment/nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
