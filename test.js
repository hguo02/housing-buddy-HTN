// Import the functions you need from the SDKs you need
import 'babel-polyfill';
import { USERS, REVIEWS, LOCATIONS, GIVEAWAYS } from './constants.js'
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
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

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);

async function getLocationReviews(locationID) {
    console.log('executing');

    const documentSnapshot = await firestore.collection(LOCATIONS).doc(locationID).get();
    const reviewIDs = documentSnapshot.data().reviewIDs;
    let reviewObjects = [];

    reviewIDs.forEach(async (id) => {
        reviewObjects.push(
            await firestore.collection(REVIEWS).doc(id).get().then((value) => {
                return value.data();
            })
        );

        console.log(id);
    });

    return reviewObjects;
}

getLocationReviews('DJBUYlcSJIeTfvUkCMQO');