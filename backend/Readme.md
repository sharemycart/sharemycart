# Code for the serverless backend

## Paradigms

### API-driven

Provide an OAS3 (swagger) file first

### Serverless

Use OpenFaaS as runtime infrastructure.
Each API path (at least each first level path) should be resolved by an own function.

## Persistence

Cloud offering. A relational DB is probably most adequate, so probably go for Postgres.

## Deployment

OpenFaaS community cluster.
