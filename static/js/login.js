let canvas;
let backgroundY = 0;
let background;
function initApp() {
    background = new Image();
    background.src = "../assets/sprites/background.png";
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.context = canvas.getContext("2d");
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    setInterval(update, 30);
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
        if (user) {
            window.location.href = "/index";
        } else {
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
function update() {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    let height = 450;
    let width = 800;
    if (backgroundY > height) {
        backgroundY = 0;
    }
    for (let j = 0; j < canvas.width + width; j += width) {
        for (let i = 0; i < canvas.height + height; i += height) {
            canvas.context.drawImage(background, 0, i - backgroundY, j - 100, canvas.height);
        }
    }
    backgroundY += 0.75;
}