Version := $(shell git describe --tags --dirty)
GitCommit := $(shell git rev-parse HEAD)
LDFLAGS := "-s -w -X main.Version=$(Version) -X main.GitCommit=$(GitCommit)"

.PHONY: all
all: docker

.PHONY: apigen
apigen:
	cd gohandlers && swagger-codegen generate -i schema/swagger.yaml -l go-server -o v2/
	rm gohandlers/main.go

.PHONY: dist
dist:
	CGO_ENABLED=0 GOOS=linux go build -ldflags $(LDFLAGS) -a -installsuffix cgo -o bin/server main.go
	CGO_ENABLED=0 GOOS=darwin go build -ldflags $(LDFLAGS) -a -installsuffix cgo -o bin/server-darwin main.go
	CGO_ENABLED=0 GOOS=linux GOARCH=arm go build -ldflags $(LDFLAGS) -a -installsuffix cgo -o bin/server-armhf main.go


.PHONY: docker
docker:
	docker build --build-arg VERSION=$(Version) --build-arg GIT_COMMIT=$(GitCommit) -t utsavanand2/sharemycart:$(Version)-amd64 .
	docker build --build-arg VERSION=$(Version) --build-arg GIT_COMMIT=$(GitCommit) --build-arg OPTS="GOARCH=arm GOARM=6" -t utsavanand2/sharemycart:$(Version)-armhf .

.PHONY: prune
prune:
	docker image prune --filter="label=maintainer=utsav" -a

.PHONY: push
push:
	docker push utsavanand2/sharemycart:$(Version)-amd64
	docker push utsavanand2/sharemycart:$(Version)-armhf

