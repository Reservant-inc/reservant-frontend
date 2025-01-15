# build step
FROM node:22-alpine as build
WORKDIR /app
# Install packages
# RUN apt -y update && apt -y upgrade && apt install -y curl
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
# COPY package.json ./
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
