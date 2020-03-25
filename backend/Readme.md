# Code for the serverless backend

Currently, what we call "backend" is just the functions implemented as DB stored procedures in Firestore.

There are plans to move to OpenFaaS and Postgres at a later point in time, but for time-to-market-reasons, Firebase is the current choice.

The downside of this is that you cannot easily run the app 100% locally: You need a connection to our Google Cloud account. Please get in touch with the dev. team viw the team's [public chat channel](https://open.rocket.chat/channel/share-my-cart) if you want to contribute and thus need the credentials for the dev. environment.
