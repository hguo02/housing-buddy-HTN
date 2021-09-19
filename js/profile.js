import { auth, getUserByID } from "../index";

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
        authBtn.setAttribute('href', '#');
        authBtn.style.cursor = 'pointer';

        initializeData();

    } else {
        console.log('user bad');
        console.log(navElements.length);

        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = 'Sign In';
        authBtn.setAttribute('href', 'auth.html');
        authBtn.removeAttribute('onclick');

        for (let i = 0; i < navElements.length; i++) {
            navElements[i].setAttribute('href', 'auth.html')
        }
    }
});

async function initializeData() {
    console.log(currentUserID);
    const user = await getUserByID(currentUserID);

    document.getElementsByClassName('profile-name')[0].innerHTML = `${user.firstName} ${user.lastName}`;
    document.getElementsByClassName('profile-email')[0].innerHTML = user.email;
    document.getElementsByClassName('fa')[0].innerHTML = " " + user.giveawayPoints;

    // document.getElementByClassName('profile-name').innerHTML = `${user.firstName} ${user.lastName}`;
    // document.getElementByClassName('profile-email').innerHTML = user.email;
    // document.getElementByClassName('fa').innerHTML = user.giveawayPoints;
}

function signUserOut() {
    signOut();
    window.location.replace('index.html');
}

window.signUserOut = signUserOut;