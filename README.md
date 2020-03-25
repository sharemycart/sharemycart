# Home Service in my contained neighborhood.

> tl;dr: Let's build an app for collaborative neighborhood groceries shopping, so we can stay contained and help not spread viruses

## Motivation

Isolation is key to not spreading the virus. Whether it's because we're locked down, because we feel sick or because we simply put ourselves in a home-quarantine: We need to reduce public movement.

Buying groceries is something we all need to do from time to time.
I'll be out probably on Friday. I'll make a shopping list, I'll order it so that I spend as few time as possible in-store, I'll buy only necessary stuff, not more than I need for my family for the week.
It would be easy for me to add another item for my neighbours if I only knew they also need the same stuff - and it would enable them to stay home.

It's really a simple process which is a (small) solution to a universal problem worldwide.

## Current state

This project is in a very early stage. It's 2020, March 18 and Sars-Cov-2 is spreading like crazy in Europe.
Though this project sounds a bit miniscule (and maybe even ridiculous compared to other initiatives like [3D-printing respirator valves for those already fighting death](https://www.fastcompany.com/90477940/these-good-samaritans-with-a-3d-printer-are-saving-lives-by-making-new-respirator-valves-for-free) ), but it's something for the better. And it's something I can do.

A fist website (in German) is online at [sharemycart.com](http://www.sharemycart.com/).

## How to contribute

So you really would like to join? Awesome!
Have a look at the [issues](https://github.com/mrsimpson/sharemycart/issues), best start with the [epics](https://github.com/mrsimpson/sharemycart/issues?q=is%3Aopen+is%3Aissue+label%3Aepic).
There is also an [issue board](https://github.com/mrsimpson/sharemycart/projects/1) outlining the next todos
Then, you can get in tough with the very new team on [a channel on the open Rocket.Chat server](https://open.rocket.chat/channel/share-my-cart)

## Getting started as a developer

This is a mono-repo with two coupled deployment units: `backend` and `ui`.
The UI is implemented using [Ionic Framework](https://ionicframework.com/) find out more in the [ui readme](./src/ui/Readme.md). For the backend [Firebase](https://firebase.google.com/) is used.

### DB and backend

The current implementation, [Firebase's Firestore](https://firebase.google.com/docs/reference/js/firebase.firestore) is being used. Firestore supplies mechanisms for reactivity and grants maximal freedom due to being hosted and scaled by Google.

Firestore also allows for implementing functions in Golang. This is waht we currently call the [`backend`](https://github.com/mrsimpson/sharemycart/tree/master/backend).

### Client side

The client is implemented using the Ionic framework and React.
Since the DB side is schema-less, the client also comprises a larger part which is responsible for data binding and business logic:

Firestore and the backend functions are consumed in the "client side backend", which is responsible for providing data access to the frontend: 

- The [`firebaseService`](https://github.com/mrsimpson/sharemycart/blob/master/ui/src/store/firebaseService.js) provides low-level functions wrapping the firestore API and ensures the schema.
- The [`Store`](https://github.com/mrsimpson/sharemycart/blob/master/ui/src/store/Store.js) consumes these functions and implements business logic. Its functions are optimized for being consumed in the components.

The UI components are implemented in React using the [Ionic library for react](https://ionicframework.com/docs/components)

### How to best understand the current code base

The current code is - to be honest - not of high quality.
Being nourished in the German WirvsVirus hackathon, quality was not the major aspect to be optimized for but speed.
Therefore, there are no extensive tests or stuff to navigate. You are probably best off by launching the app from the `ui` folder using `npm start`. Be sure you provided the credentials either as environment variables (see [`.env.sample`]((https://github.com/mrsimpson/sharemycart/blob/master/ui/.env.sample) for how it has to look like).

Then, open VSCode and add a breakpoint in a UI-component, e. g. `App`. Launch the Chrome using the launch target ![ ](./docs/contribute/debugger.png "VS Code debugger launch Chrome").

*You are not a coder but still want to help*
Even more great! Check the issues, comment on epics, write own ideas, join the chat. Looking forward to reading from you.
