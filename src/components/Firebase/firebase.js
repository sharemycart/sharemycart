import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { LIST_TYPE_SHOPPING, LIST_TYPE_NEED } from '../../constants/lists';

const INVALID_DUMMY_UID = 'idonotexist'; // can be used in order to create queries which intentionally don't match anything

const config = {
  apiKey: process.env.REACT_APP_BACKEND_API_KEY,
  authDomain: process.env.REACT_APP_BACKEND_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_BACKEND_DATABASE_URL,
  projectId: process.env.REACT_APP_BACKEND_PROJECT_ID,
  storageBucket: process.env.REACT_APP_BACKEND_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_BACKEND_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_BACKEND_SENDER_APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.firestore()

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.doc(`users/${uid}`);
  users = () => this.db.collection('users');

  // *** Message API ***

  message = uid => this.db.doc(`messages/${uid}`);
  messages = () => this.db.collection('messages');

  // *** Lists API ***
  list = uid => this.db.doc(`lists/${uid}`);
  lists = () => this.db.collection('/lists');

  currentList = (type) => this.db.collection('/lists')
    .where('type', '==', type)
    .where('isCurrent', '==', true)
    .limit(1);

  editList = (uid, list) => this.list(uid)
    .set(Object.assign(list,
      {
        editedAt: this.fieldValue.serverTimestamp()
      }));

  deleteList = async uid => {
    const toBeDeleted = await this.list(uid).get()

    if (toBeDeleted.exists) {
      const deleted = toBeDeleted.data();

      await this.list(uid).delete()

      if ( deleted.isCurrent) {
        // make sure there's a new current list
        const otherListOfSameType = await this.lists()
          .where('userId', '==', deleted.userId)
          .where('type', '==', deleted.type)
          .limit(1)
          .get()

        otherListOfSameType.docs.forEach(
          (s) => s.ref.update('isCurrent', true)
          )
      }
    }
  }

  listItems = listUid => this.db.doc(`lists/${listUid}`)
    .collection('items'); // don't use a nested path expression for the sub-collection!

  listItem = (listUid, uid) => this.db.doc(`lists/${listUid}`)
    .collection('/items/')
    .doc(uid);

  // CRUD
  createItem = (listUid, item) => this.listItems(listUid)
    .add(Object.assign(item,
      {
        createdAt: this.fieldValue.serverTimestamp()
      }));

  editItem = (listUid, item) => this.listItem(listUid, item.uid)
    .set(Object.assign(item,
      {
        editedAt: this.fieldValue.serverTimestamp()
      }));

  deleteItem = (listUid, uid) => this.listItem(listUid, uid)
    .delete()

  // *** Shopping API ***
  currentShoppingList = () => this.currentList(LIST_TYPE_SHOPPING);

  myShoppingLists = () => this.lists()
    .where('userId', '==', this.auth.currentUser
      ? this.auth.currentUser.uid
      : INVALID_DUMMY_UID)
    .where('type', '==', LIST_TYPE_SHOPPING)

  setCurrentShoppingList = uid => {
    this.currentShoppingList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.list(uid).update('isCurrent', true))
  }

  createShoppingList = async ({ name }) => {
    const snapshot = await this.currentShoppingList().get()
    snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))

    return this.lists().add({
      name,
      type: LIST_TYPE_SHOPPING,
      userId: this.auth.currentUser.uid,
      isCurrent: true,
      createdAt: this.fieldValue.serverTimestamp(),
    })
  };

  // *** Needs API ***
  currentNeedsList = () => this.currentList(LIST_TYPE_NEED);
  
  setCurrentNeedsList = uid => {
    this.currentNeedsList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.list(uid).update('isCurrent', true))
  }

  createNeedsList = async ({ name }) => {
    const snapshot = await this.currentNeedsList().get()
    snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))

    return this.lists().add({
      name,
      type: LIST_TYPE_NEED,
      userId: this.auth.currentUser.uid,
      isCurrent: true,
      createdAt: this.fieldValue.serverTimestamp(),
    })
  };
  myNeedsLists = () => this.lists()
    .where('userId', '==', this.auth.currentUser
      ? this.auth.currentUser.uid
      : INVALID_DUMMY_UID)
    .where('type', '==', LIST_TYPE_NEED)

  createNeedsListForShoppingList = (shoppingListUid, name) => {
    this.currentNeedsList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })

    return this.myNeedsListsForShoppingList(shoppingListUid)
      .then((existingNeedsList) => existingNeedsList
        ? existingNeedsList.update('isCurrent', true)
        : this.lists()
          .add({
            type: LIST_TYPE_NEED,
            shoppingListUid,
            isCurrent: true,
            name,
            userId: this.auth.currentUser.uid,
            createdAt: this.fieldValue.serverTimestamp()
          })
      )
  }

  myNeedsListsForShoppingList = async shoppingListUid => {
    let needsListsRef = null
    const q = this.myNeedsLists()
      .where('shoppingListUid', '==', shoppingListUid)
      .limit(1)

    const needsListsSnapshots = await q.get()
    needsListsSnapshots.docs.forEach(sl => { needsListsRef = sl.ref; return false })

    return needsListsRef;
  }
}

export default Firebase;
