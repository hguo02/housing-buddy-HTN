// Import the functions you need from the SDKs you need
import 'babel-polyfill';
import { USERS, REVIEWS, LOCATIONS, GIVEAWAYS, IMAGES } from './js/constants.js'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import uuid from "uuid";
// import { getFirestore, collection, doc, getDoc, getDocs, query } from "firebase/firestore";


// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkfTS_GTzav5PeqXHymLkXer_HzSPFs60",
    authDomain: "housing-buddy.firebaseapp.com",
    projectId: "housing-buddy",
    storageBucket: "housing-buddy.appspot.com",
    messagingSenderId: "629222902668",
    appId: "1:629222902668:web:37cc17a1c1ffcdb4e364a9",
    measurementId: "G-1BCV6QWHH8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();
const storage = app.storage();
const auth = app.auth();


// ******************************************************************
// Auth

async function signInWithEmailAndPassword(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
        console.log(e);
    }
}

async function signUpWithEmailAndPassword(email, password) {
    try {
        const credential = await auth.createUserWithEmailAndPassword(email, password);
        return credential;
    } catch (e) {
        console.log(e);
    }
}

async function signOut() {
    try {
        await auth.signOut();
    } catch (e) {
        console.log(e);
    }
}

async function updateUser(user, userID) {
    try {
        await firestore.collection(USERS).doc(user.userID).set(user);
        // await firestore.collection(USERS).doc(user.id).set(user).then((_) => {
        //     return user;
        // });
    } catch (e) {
        console.log(e);
    }
}

async function getUserByID(id) {
    return (await firestore.collection(USERS).doc(id).get()).data();
}
async function getLocationByID(id) {
    return (await firestore.collection(LOCATIONS).doc(id).get()).data();
}
async function updateLocationRating(id, newRating, newRecommend) {
    try {
        await firestore.collection(LOCATIONS).doc(id).update({
            rating: newRating,
            recommendedCount: newRecommend,
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
function getCurrentUser() {
    return auth.currentUser;
}

function getServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
}

// ******************************************************************
// App Functions

/// Uploads [image] to Firebase Storage, and returns the download URL.
async function uploadImageToFirebaseStorage(image) {
    const id = uuid.v4();
    const storageRef = storage.ref().child(`${IMAGES}/${id}`);

    await storageRef.put(image);

    return (await storageRef.getDownloadURL());
}

/// Returns an array of all the JSON location objects found in the registry.
async function getAllLocations() {
    const documentSnapshot = await firestore.collection(LOCATIONS).get();
    return documentSnapshot.docs.map((element) => element.data());
}

/// Returns a JSON location object for [locationID]. √
async function getLocationData(locationID) {
    const documentSnapshot = await firestore.collection(LOCATIONS).doc(locationID).get();
    return documentSnapshot.data();
}

/// Returns an array of JSON review objects for [locationID]. √
async function getLocationReviews(locationID) {
    const documentSnapshot = await firestore.collection(LOCATIONS).doc(locationID).get();
    const reviewIDs = documentSnapshot.data().reviewIDs;
    let reviewObjects = [];

    for (let i = 0; i < reviewIDs.length; i++) {
        const id = reviewIDs[i];
        const review = await firestore.collection(REVIEWS).doc(id).get();
        reviewObjects.push(review.data());
    }

    console.log(`Retrieved ${reviewObjects.length} reviews for ${locationID}.`);
    return reviewObjects;
}

/// Creates a review for [locationID]. Accepts a JSON object [review]. √
/// Returns true if succeeded, else false.
async function createReview(locationID, review) {
    const reviewCollection = firestore.collection(REVIEWS);
    const locationRef = firestore.collection(LOCATIONS).doc(locationID);
    const documentID = reviewCollection.doc().id;

    review.id = documentID;

    try {
        await reviewCollection.doc(documentID).set(review);
        await locationRef.update({
            reviewIDs: firebase.firestore.FieldValue.arrayUnion(documentID)
        })
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function enterGiveaway(userID) {
    const docID = firestore.collection(GIVEAWAYS).doc().id;
    const entry = {
        id: docID,
        entrant: userID,
    };

    const giveaway = await firestore.collection(GIVEAWAYS).doc('primary').get().then((value) => value.data());
    const user = await firestore.collection(USERS).doc(userID).get().then((value) => value.data());
    const entryCost = giveaway.entryCost;

    if (user.giveawayPoints >= entryCost) {
        try {
            await firestore.collection(USERS).doc(userID).update({
                giveawayPoints: firebase.firestore.FieldValue.increment(-entryCost),
            });
            await firestore.collection(GIVEAWAYS).doc('primary').update({
                entries: firebase.firestore.FieldValue.arrayUnion([entry]),
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    } else {
        return false;
    }
}

async function getUserGiveawayEntries(userID) {
    const res = firestore.collection(GIVEAWAYS).doc('primary').get().then((value) => {
        return value.data();
    });

    const entries = res.entries;
    const counter = 0;

    for (let i = 0; i < entries.length; i++) {
        if (entries[i].entrant === userID) {
            counter++;
        }
    }

    return counter;
}


// ******************************************************************
// Testing (ONLY FOR US DO NOT PUSH)
// async function callAsync() {
//     const result = await getLocationReviews('7TahmGCGceaQYEAx1Mgm');
//     console.log(result);
// }

// callAsync();


// async function createLocation() {

// }



export {
    getAllLocations,
    getLocationData,
    getLocationReviews,
    createReview,
    enterGiveaway,
    updateUser,
    getUserByID,
    getLocationByID,
    getCurrentUser,
    getServerTimestamp,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    updateLocationRating,
    auth,
    signOut,
};