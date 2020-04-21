import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
  };

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase }); 