# Code for the frontend

## Paradigms

JAM-stack
Mobile enabled, ideally PWA capable framework for offline usage (=> probably React, Vue)

## Tooling
Ionic Framework React application (PWA by default), easily exportable with Capacitor to native app.
Docs here: https://ionicframework.com/

@todo: Add offline usage support

## Deployment 

Github pages
@todo: maybe this helps: https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f

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

## UI instructions
For the moment we have decided to keep the UI in a separate app.
To lift the server framework in development mode, please do
CD to the UI directory.
```bash
cd src/ui
```
Then run an install just in case.
```bash
npm install
```

Last but not least, serve your app locally.
```bash
ionic serve
#enjoy the magic :)
```
For more instructions in ionic build see here: https://ionicframework.com/docs/cli/commands/build