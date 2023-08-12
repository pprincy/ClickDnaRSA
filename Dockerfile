FROM node:14-alpine3.12 as builder

# make the 'app' folder the current working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./app/package.json ./

# Upgrading npm version
RUN npm install -g npm@6.14.13

# install project dependencies
RUN npm install .

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./app .


ARG api_url
ARG api_key
ARG api_env
ENV VUE_APP_API_BASE_URL=$api_url
ENV VUE_APP_SUBSCRIPTION_KEY=$api_key
ENV VUE_APP_CLICKDNAENV=$api_env

RUN echo "Generating env.production file" && printenv
RUN printenv > .env.production
RUN npm run build


########################
### Production Nginx ###
########################

FROM nginx:1.19.8-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
