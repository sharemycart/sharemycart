# Code for the frontend

## Paradigms

JAM-stack
Mobile enabled, ideally PWA capable framework for offline usage (=> probably React, Vue)

## Tooling

Whatever the frontender prefers.

## Deployment 

Github pages

## Mock server

In order to facilitate development of the frontend while the backend is in the process of being constructed, we can utilize a mock based on the swagger-file: 

```bash
npm run mock-backend
```

will start up a development server serving *the examples* from the backend swagger-file.

```bash
npm run mock-backend-dynamic
```

will start up a development server serving *random data* which matches the type definitions from the backend swagger-file.