# ShareMyCart GoLang backend

## Paradigms

### API-driven

Provide an OAS3 (swagger) file first

### Serverless

Use OpenFaaS as runtime infrastructure.
Each API path (at least each first level path) should be resolved by an own function.

### Persistence

Cloud offering. A relational DB is probably most adequate, so probably go for Postgres.

## Deployment

OpenFaaS community cluster.



## Building the server binary
```sh
make apigen
```

## Build the Dockerfile

```sh
make docker
```

## Run the docker image

```sh
# Export the contents of the firebase service account JSON file to an environment variable
export SVC=$(cat path/to/your/firebaseServiceAccount.json)
docker run --rm -d -p 8080:8080 utsavanand2/sharemycart:latest --svc=$SVC
```