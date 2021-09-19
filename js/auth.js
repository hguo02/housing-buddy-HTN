import { signInWithEmailAndPassword, signUpWithEmailAndPassword, updateUser, signOut } from "../index";

// console.log("dog");

// document.getElementById('sign-in-btn').addEventListener('click', () => {
//     signInWithEmailAndPassword(
//         document.getElementById('email-sign-in').value,
//         document.getElementById('password-sign-in').value,
//     );
// });

function signIn() {
    var email = document.getElementById("email-sign-in").value;
    var password = document.getElementById("password-sign-in").value;
    signInWithEmailAndPassword(email, password).then((_) => {
        window.location.replace('index.html');
    });
}

window.signIn = signIn;


async function signUp() {
    var fullName = document.getElementById("full-name").value;
    var email = document.getElementById("email-sign-up").value;
    var password = document.getElementById("password-sign-up").value;
    var confirm = document.getElementById("confirm-password").value
    console.log("signup");
    if (password == confirm) {
        console.log('Checkpoint 1');
        const userCredential = await signUpWithEmailAndPassword(email, password);
        console.log('Checkpoint 2');
        const firebaseUser = userCredential.user;
        const userID = firebaseUser.uid;
        const userEmail = firebaseUser.email;
        const displayName = fullName;
        const result = displayName.split(' ');

        let firstName;
        let lastName;

        if (result.length > 1) {
            firstName = result[0];
            lastName = result[result.length - 1];
        }

        console.log(userID);
        console.log(userEmail);
        console.log(displayName);
        console.log(firstName);
        console.log(lastName);

        const user = {
            userID: userID,
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            giveawayPoints: 0,
        };

        updateUser(user).then((_) => {
            window.location.replace('index.html');
        });

    } else {
        alert('Passwords are not matching.');
    }
}

window.signUp = signUp;

// document.getElementById('sign-up-btn').addEventListener('click', () => {

//     // Validate
//     const password = document.getElementById('password-sign-up').value;

//     if (password == document.getElementById('confirm-password').value) {
//         signUpWithEmailAndPassword(
//             document.getElementById('email-sign-up').value,
//             document.getElementById('password-sign-up').value,
//         );
//     } else {
//         alert('Passwords are not matching.');
//     }
// });
