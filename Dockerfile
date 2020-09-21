# Create temporary frontend backend
FROM golang:rc-alpine as backend
COPY ./backend/ /go/src/github.com/SmolyaninovVlad/
RUN apk add --no-cache --virtual .build-deps --update gcc musl-dev git make\
    && go get -u "github.com/gorilla/mux" \
    && go get -u "github.com/robfig/cron" \
    && go get -u "go.mongodb.org/mongo-driver/bson" \
    && go get -u "go.mongodb.org/mongo-driver/mongo" \
    && go get -u "gopkg.in/unrolled/render.v1" \
    && cd /go/src/github.com/SmolyaninovVlad/go-server \
    && go build -o application main.go

# Create temporary frontend container
#FROM node:alpine as frontend
# WORKDIR /app
# COPY /frontend/ ./
# RUN npm i \ 
#     && npm i -g webpack webpack-dev-server webpack-cli \
#     && npm run build

# Create prodaction application container
FROM alpine:latest as production
WORKDIR /usr/app
COPY --from=backend /go/src/github.com/SmolyaninovVlad/go-server/application ./application
# COPY --from=frontend /app/dist/ ./static/
COPY ./frontend/dist/ ./static/
RUN chmod +x ./application
EXPOSE 2222
ENTRYPOINT [ "./application" ]
#ENTRYPOINT [ "/bin/sh" ]