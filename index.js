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
        window.location.replace('index.html');
    } catch (e) {
        console.log(e);
    }
}

async function signUpWithEmailAndPassword(email, password) {
    try {
        let userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;
        const userID = firebaseUser.uid;
        const email = firebaseUser.email;
        const displayName = firebaseUser.displayName;
        const result = displayName.split(' ');

        let firstName;
        let lastName;

        if (result.length > 1) {
            firstName = result[0];
            lastName = result[result.length - 1];
        }

        const user = {
            userID: userID,
            email: email,
            firstName: firstName,
            lastName: lastName,
            giveawayPoints: 0,
        };

        await updateUser(user);
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

async function updateUser(user) {
    try {
        await firestore.collection(USERS).doc(user.id).set(user).then((_) => {
            return user;
        });
    } catch (e) {
        console.log(e);
    }
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


// ******************************************************************
// Testing (ONLY FOR US DO NOT PUSH)
async function callAsync() {
    const result = await getLocationReviews('7TahmGCGceaQYEAx1Mgm');
    console.log(result);
}

callAsync();


async function createLocation() {

}



export { createReview };