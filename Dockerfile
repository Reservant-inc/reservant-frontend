# build step
FROM node:22-alpine as build
WORKDIR /app
COPY . ./
RUN npm i
ARG REACT_APP_SERVER_IP="sekude"
ENV REACT_APP_SERVER_IP $REACT_APP_SERVER_IP
RUN npm run build

# release step
FROM nginx:1.21.5-alpine as release
COPY --from=build /app/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
