FROM golang:1.13.8-alpine3.11 as dev

LABEL maintainer=utsav

RUN mkdir /app

WORKDIR /app

COPY . ./

ARG GIT_COMMIT
ARG VERSION
ARG OPTS

RUN env ${OPTS} CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w -X main.GitCommit=${GIT_COMMIT} -X main.Version=${VERSION}" -a -installsuffix cgo -o /app/server \
    && addgroup -S app \
    && adduser -S -g app app

FROM alpine:3.11

LABEL maintainer=utsav

RUN mkdir /app
WORKDIR /app

COPY --from=dev /etc/passwd /etc/group /etc/
COPY --from=dev /app/server /app/server

USER app

EXPOSE 8080

ENTRYPOINT ["/app/server", "--port=8080"]