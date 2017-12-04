function initApp() {
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         // User is signed in.
    //         let displayName = user.displayName;
    //         let email = user.email;
    //         let emailVerified = user.emailVerified;
    //         let photoURL = user.photoURL;
    //         let uid = user.uid;
    //         let phoneNumber = user.phoneNumber;
    //         let providerData = user.providerData;
    //         user.getIdToken().then(function(accessToken) {
    //             document.getElementById('sign-in-status').textContent = 'Signed in';
    //             document.getElementById('sign-in').textContent = 'Sign out';
    //             document.getElementById('account-details').textContent = JSON.stringify({
    //                 displayName: displayName,
    //                 email: email,
    //                 emailVerified: emailVerified,
    //                 phoneNumber: phoneNumber,
    //                 photoURL: photoURL,
    //                 uid: uid,
    //                 accessToken: accessToken,
    //                 providerData: providerData
    //             }, null, '  ');
    //         });
    //     } else {
    //
    //         // User is signed out.
    //         document.getElementById('sign-in-status').textContent = 'Signed out';
    //         document.getElementById('sign-in').textContent = 'Sign in';
    //         document.getElementById('account-details').textContent = 'null';
    //     }
    // }, function(error) {
    //     console.log(error);
    // });
}
function logIn() {
    let errorMessage = $("#errorMessage");
    errorMessage.val("");
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        if(user) {
            window.location.href = "/index";
        } else{
            errorMessage.html("Wrong username or password.");
        }
    }).catch((error) => {
        errorMessage.html(error.message);
    });
}
function createAccount() {
    let errorMessage = $("#errorMessage");
    errorMessage.val("");
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
        window.location.href = "/index";
    }).catch((error) => {
        errorMessage.html(error.message);
    });
}