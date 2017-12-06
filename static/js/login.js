let canvas;
let backgroundY = 0;
let background;
function resizeCanvas() {
    let canvas = document.getElementById("mycanvas");
    if (canvas.width < window.innerWidth) {
        canvas.width = window.innerWidth;
    }

    if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight;
    }
}
function initApp() {
    background = new Image();
    background.src = "../assets/sprites/background.png";
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute("id", "mycanvas");
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    setInterval(update, 30);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.href = "/index";
        }
    }, function (error) {
        console.log(error);
    });
}
function logIn() {
    let errorMessage = $("#errorMessage");
    errorMessage.html("");
    let userName = document.getElementById("inputEmail").value;
    let email = userName + "@gmail.com";
    let password = document.getElementById("inputPassword").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user) {
            window.location.href = "/index";
        } else {
            errorMessage.html("Wrong username or password.");
        }
    }).catch((error) => {
        errorMessage.html("Wrong username or password.");
    });
}
function createAccount() {
    let errorMessage = $("#errorMessage");
    errorMessage.html("");
    let userName = document.getElementById("inputEmail").value;
    if (userName.indexOf("@") !== -1 || userName.indexOf(" ") !== -1) {
        errorMessage.html("Please do not include @ or spaces in your username.");
        return;
    }
    else if (userName.length < 2) {
        errorMessage.html("Please make username at least 2 characters long.");
        return;
    }
    let email = userName + "@gmail.com";
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
    for (let j = 0; j < canvas.width + width * 2; j += width) {
        for (let i = 0; i < canvas.height + height * 2; i += height) {
            canvas.context.drawImage(background, 0, i - backgroundY, j - 100, canvas.height);
        }
    }
    backgroundY += 0.75;
}