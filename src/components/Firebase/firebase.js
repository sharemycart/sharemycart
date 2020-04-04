import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { LIST_TYPE_SHOPPING, LIST_TYPE_NEED, LIFECYCLE_STATUS_OPEN } from '../../constants/lists';

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

console.log(JSON.stringify(config))

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

            const dbUser = snapshot.exists
              ? snapshot.data()
              : {};

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

  myCurrentList = (type) => this.db.collection('/lists')
    .where('type', '==', type)
    .where('isCurrent', '==', true)
    .where('userId', '==', this.auth.currentUser
      ? this.auth.currentUser.uid
      : INVALID_DUMMY_UID)
    .limit(1);

  createList = ({ name }, type) => this.lists().add({
    name,
    type,
    userId: this.auth.currentUser.uid,
    isCurrent: true,
    lifecycleStatus: LIFECYCLE_STATUS_OPEN,
    createdAt: this.fieldValue.serverTimestamp(),
  })
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

      if (deleted.isCurrent) {
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

  listItems = listId => this.db.doc(`lists/${listId}`)
    .collection('items'); // don't use a nested path expression for the sub-collection!

  listItem = (listId, uid) => this.db.doc(`lists/${listId}`)
    .collection('/items/')
    .doc(uid);

  // CRUD
  createItem = (listId, item) => this.listItems(listId)
    .add(Object.assign(item,
      {
        createdAt: this.fieldValue.serverTimestamp()
      }));

  editItem = (listId, item) => this.listItem(listId, item.uid)
    .set(Object.assign(item,
      {
        editedAt: this.fieldValue.serverTimestamp()
      }));

  deleteItem = (listId, uid) => this.listItem(listId, uid)
    .delete()

  // *** Shopping API ***
  myCurrentShoppingList = () => this.myCurrentList(LIST_TYPE_SHOPPING);

  myShoppingLists = () => this.lists()
    .where('userId', '==', this.auth.currentUser
      ? this.auth.currentUser.uid
      : INVALID_DUMMY_UID)
    .where('type', '==', LIST_TYPE_SHOPPING)

  setCurrentShoppingList = uid => {
    this.myCurrentShoppingList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.list(uid).update('isCurrent', true))
  }

  createShoppingList = async ({ name }) => {
    const snapshot = await this.myCurrentShoppingList().get()
    snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))

    return this.createList({ name }, LIST_TYPE_SHOPPING);
  };

  // *** Needs API ***
  myCurrentNeedsList = () => this.myCurrentList(LIST_TYPE_NEED);

  setCurrentNeedsList = uid => {
    this.myCurrentNeedsList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })
      .then(() => this.list(uid).update('isCurrent', true))
  }

  createNeedsList = async ({ name }) => {
    const snapshot = await this.myCurrentNeedsList().get()
    snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))

    return this.createList({ name }, LIST_TYPE_NEED)
  }

  myNeedsLists = () => this.lists()
    .where('userId', '==', this.auth.currentUser
      ? this.auth.currentUser.uid
      : INVALID_DUMMY_UID)
    .where('type', '==', LIST_TYPE_NEED)

  dependentNeedsListOfShoppingList = (shoppingListId) => this.lists()
    .where('shoppingListId', '==', shoppingListId)

  createNeedsListForShoppingList = (shoppingListId, name) => {
    this.myCurrentNeedsList().get()
      .then((snapshot) => {
        snapshot.docs.forEach((s) => s.ref.update('isCurrent', false))
      })

    return this.list(shoppingListId)
      .get()
      .then(snapshot => snapshot.data())
      .then((shoppingList) => {
        this
          .myNeedsListsForShoppingList(shoppingListId)
          .then((existingNeedsList) => existingNeedsList
            ? existingNeedsList.update('isCurrent', true)
            : this.lists()
              .add({
                type: LIST_TYPE_NEED,
                shoppingListId,
                shoppingListOwnerId: shoppingList.userId,
                isCurrent: true,
                name,
                userId: this.auth.currentUser.uid,
                createdAt: this.fieldValue.serverTimestamp()
              })
          )
      })
  }

  myNeedsListsForShoppingList = async shoppingListId => {
    let needsListsRef = null
    const q = this.myNeedsLists()
      .where('shoppingListId', '==', shoppingListId)
      .limit(1)

    const needsListsSnapshots = await q.get()
    needsListsSnapshots.docs.forEach(sl => { needsListsRef = sl.ref; return false })

    return needsListsRef;
  }

  addNeededItemFromShoppingListItem = (needsListId, shoppingListItem) => {
    const neededItem = shoppingListItem;

    neededItem.OriginShoppingItemUid = shoppingListItem.uid;
    neededItem.quantity = 0;
    delete neededItem.createdAt;
    delete neededItem.editedAt;
    //TODO: prevent creation of duplicate needs
    return this.createItem(needsListId, neededItem)
  }
}

export default Firebase;
