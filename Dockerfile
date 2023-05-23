FROM 720150013645.dkr.ecr.us-west-2.amazonaws.com/node-slim:latest AS vue_builder
ARG ENV_TAG
WORKDIR /client
COPY ./client/package.json ./package.json
RUN yarn install
COPY ./client .
RUN yarn run cesppa:$ENV_TAG

FROM 720150013645.dkr.ecr.us-west-2.amazonaws.com/nginx-stable:latest
ARG NGINX_CONFIG
COPY --from=vue_builder /client /code
RUN mkdir /logs
RUN rm etc/nginx/nginx.conf && rm etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx
COPY ${NGINX_CONFIG} /etc/nginx/conf.d/nginx-client.conf
