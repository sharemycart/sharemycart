import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { LIST_TYPE_SHOPPING, LIST_TYPE_NEED, LIFECYCLE_STATUS_OPEN, LIFECYCLE_STATUS_SHOPPING, LIFECYCLE_STATUS_FINISHED, LIFECYCLE_STATUS_ARCHIVED } from '../../constants/lists';

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
      : INVALID_DUMMY_UID);

  createList = ({ name = new Date().toLocaleDateString() }, type) => this.lists().add({
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

  createListFromTemplate = async (template, excludeShoppedItems = true) => {
    const newList = await this.createList({}, template.type)

    template.type === LIST_TYPE_SHOPPING
      ? this.setCurrentShoppingList(newList.id)
      : this.setCurrentNeedsList(newList.id)

    const templateItems = await this.listItems(template.uid).get()
    templateItems.forEach(itemSnapshot => {
      const item = itemSnapshot.data()
      if (!item.shopped || !excludeShoppedItems) {
        delete item.id;
        delete item.shopped;
        delete item.shoppedAt;
        delete item.shoppedBy;
        this.createItem(newList.id, item)
      }
    })

    return newList
  }

  listItems = listId => this.db.doc(`lists/${listId}`)
    .collection('items');

  listItem = (listId, uid) => this.db.doc(`lists/${listId}`)
    .collection('/items/')
    .doc(uid);

  // CRUD
  createItem = (listId, item) => this.listItems(listId)
    .add(Object.assign(item,
      {
        order: item.order || -1,
        createdAt: this.fieldValue.serverTimestamp()
      }));

  editItem = (listId, item) => this.listItem(listId, item.uid)
    .set(Object.assign(item,
      {
        editedAt: this.fieldValue.serverTimestamp()
      }));

  deleteItem = (listId, uid) => this.listItem(listId, uid)
    .delete()

  setItemsOrder = (listId, items, order) => {
    const batch = this.db.batch()
    items.forEach(i => batch.update(this.listItem(listId, i.uid), 'order', order[i.uid] || 0))
    batch.commit()
  }

  shopItem = (listId, uid, shopped = true) => this.listItem(listId, uid)
    .update(
      {
        shopped,
        shoppedBy: this.auth.currentUser.uid,
        shoppedAt: this.fieldValue.serverTimestamp(),
        editedAt: this.fieldValue.serverTimestamp()
      }
    )

  // *** Shopping API ***
  myCurrentShoppingList = () => this.myCurrentList(LIST_TYPE_SHOPPING);

  myShoppingLists = (includeArchived = false) => {
    const status = [LIFECYCLE_STATUS_OPEN, LIFECYCLE_STATUS_SHOPPING, LIFECYCLE_STATUS_FINISHED, LIFECYCLE_STATUS_ARCHIVED]
    if (includeArchived) status.push(LIFECYCLE_STATUS_ARCHIVED)
    return this.lists()
      .where('userId', '==', this.auth.currentUser
        ? this.auth.currentUser.uid
        : INVALID_DUMMY_UID)
      .where('type', '==', LIST_TYPE_SHOPPING)
      // .where('lifecycleStatus', "in", status) yields an empty list, though it should work as per the spec
  }

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

  _setShoppingListLifecycleStatusPropagating = async (uid, targetStatus) => {
    const batch = this.db.batch()
    batch.update(this.list(uid), 'lifecycleStatus', targetStatus)
    const dependentShoppingLists = await this.dependentNeedsListOfShoppingList(uid).get()
    dependentShoppingLists.forEach(needsList => {
      batch.update(needsList.ref, 'lifecycleStatus', targetStatus)
    })
    return batch.commit()
  }

  openShopping = async (shoppingList) => {
    if (shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_OPEN
      && shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED) {
      this._setShoppingListLifecycleStatusPropagating(shoppingList.uid, LIFECYCLE_STATUS_OPEN)
    }
  }

  goShopping = async (shoppingList) => {
    if (shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_SHOPPING
      && shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED) {
      this._setShoppingListLifecycleStatusPropagating(shoppingList.uid, LIFECYCLE_STATUS_SHOPPING)
    }
  }

  finishShopping = async (shoppingList) => {
    if (shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_FINISHED
      && shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED) {
      this._setShoppingListLifecycleStatusPropagating(shoppingList.uid, LIFECYCLE_STATUS_FINISHED)
    }
  }

  archiveShoppingList = async (shoppingList) => {
    if (shoppingList.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED) {
      this._setShoppingListLifecycleStatusPropagating(shoppingList.uid, LIFECYCLE_STATUS_ARCHIVED)
    }
  }


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

  myNeedsLists = (includeArchived = false) => {
    const status = [LIFECYCLE_STATUS_OPEN, LIFECYCLE_STATUS_SHOPPING, LIFECYCLE_STATUS_FINISHED]
    if (includeArchived) status.push(LIFECYCLE_STATUS_ARCHIVED)

    return this.lists()
      .where('userId', '==', this.auth.currentUser
        ? this.auth.currentUser.uid
        : INVALID_DUMMY_UID)
      .where('type', '==', LIST_TYPE_NEED)
// .where('lifecycleStatus', "in", status) yields an empty list, though it should work as per the spec  }
  }
  
  dependentNeedsListOfShoppingList = (shoppingListId) => this.lists()
    .where('shoppingListId', '==', shoppingListId)

  createNeedsListForShoppingList = (shoppingListId, name) => {
    this.myCurrentNeedsList().get()
      .then((snapshot) => {
        if (snapshot.size) {
          snapshot.docs.forEach((s) => {
            // we need to update all needs lists which are not referenced to the shopping list
            const needsList = s.data();
            if (needsList.shoppingListId !== shoppingListId) {
              s.ref.update('isCurrent', false)
            }
          })
        }
      })

    return this.list(shoppingListId)
      .get()
      .then(snapshot => snapshot.data())
      .then((shoppingList) => {
        this
          .myNeedsListsForShoppingList(shoppingListId)
          .then((existingNeedsList) => {
            if (existingNeedsList && existingNeedsList.id) {
              existingNeedsList.update('isCurrent', true)
            } else {
              this.lists()
                .add({
                  type: LIST_TYPE_NEED,
                  shoppingListId,
                  shoppingListOwnerId: shoppingList.userId,
                  isCurrent: true,
                  name,
                  order: -1,
                  userId: this.auth.currentUser.uid,
                  lifecycleStatus: shoppingList.lifecycleStatus,
                  createdAt: this.fieldValue.serverTimestamp()
                })
            }
          })
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

  addNeededItemFromShoppingListItem = (needsListId, shoppingListItem, quantity = '') => {
    const neededItem = shoppingListItem;

    neededItem.OriginShoppingItemUid = shoppingListItem.uid;
    neededItem.quantity = quantity;
    delete neededItem.createdAt;
    delete neededItem.editedAt;
    delete neededItem.uid;
    delete neededItem.parentId;
    delete neededItem.shopped;
    delete neededItem.shoppedAt;
    delete neededItem.shoppedBy;
    //TODO: prevent creation of duplicate needs
    return this.createItem(needsListId, neededItem)
  }
}

export default Firebase;
