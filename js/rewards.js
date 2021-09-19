import { auth } from "../index";

let currentUserID;
const navElements = document.querySelectorAll('.private');

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUserID = user.uid;
        console.log('user good');
        console.log(user.uid);

        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = 'Logout';
        authBtn.setAttribute('onclick', 'signUserOut()');
        authBtn.removeAttribute('href');
        // authBtn.setAttribute('href', '/');
        // authBtn.setAttribute('href', '#');
        authBtn.style.cursor = 'pointer';
    } else {
        console.log('user bad');

        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = 'Sign In';
        authBtn.setAttribute('href', 'auth.html');
        authBtn.removeAttribute('onclick');

        for (let i = 0; i < navElements.length; i++) {
            navElements[i].setAttribute('href', 'auth.html')
        }
    }
});

// function signUserOut() {
    // signOut();
    // window.location.replace('index.html');
// }

// window.signUserOut = signUserOut;