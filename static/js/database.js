/**
 * Created by scarbone on 11/12/17.
 */
let counter = 1;
let firebaseRef = firebase.database().ref('leaderboard');
let scores = [];
let userCurrentScore;
function getScores(score) {
    userCurrentScore = score;
    firebaseRef.orderByChild('negativeScore').limitToFirst(15).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshots) {
            scores.push(parseInt(childSnapshots.child('score').val()));
        });
        let user = firebase.auth().currentUser;
        if (parseInt(score) > parseInt(scores[scores.length - 1]) || scores.length < 15) {
            let userName = user.displayName;
            if(userName === null){
                userName = user.email.split("@")[0];
            }
            firebaseRef.child(user.uid + score).child('username').set(userName).then(() => {
                firebaseRef.child(user.uid + score).child('score').set(score).then(() => {
                    firebaseRef.child(user.uid + score).child('negativeScore').set(-1 * score).then(() => {
                        initBoard();
                    });
                });
            });
        }
        else {
            initBoard();
        }
    });
}
function initBoard() {
    let user = firebase.auth().currentUser;
    counter = 1;
    let board = document.getElementById('leaderboard');
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    let row = document.createElement('DIV');
    let usernameCol = document.createElement('DIV');
    let scoreCol = document.createElement('DIV');
    let placeCol = document.createElement('DIV');
    let place = document.createElement('SPAN');
    let username = document.createElement('SPAN');
    let score = document.createElement('SPAN');
    place.innerHTML = '#';
    username.innerHTML = 'USERNAME';
    score.innerHTML = 'SCORE';
    row.classList.add('row');
    usernameCol.classList.add('col-sm-4');
    scoreCol.classList.add('col-sm-4');
    place.classList.add('col-sm-4');
    usernameCol.appendChild(username);
    scoreCol.appendChild(score);
    placeCol.appendChild(place);
    row.appendChild(placeCol);
    row.appendChild(usernameCol);
    row.appendChild(scoreCol);
    board.appendChild(row);
    firebaseRef.orderByChild('negativeScore').limitToFirst(15).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshots) {
            let row = document.createElement('DIV');
            let usernameCol = document.createElement('DIV');
            let scoreCol = document.createElement('DIV');
            let placeCol = document.createElement('DIV');
            let place = document.createElement('SPAN');
            let username = document.createElement('SPAN');
            let score = document.createElement('SPAN');
            place.innerHTML = counter;
            username.innerHTML = childSnapshots.child('username').val();
            score.innerHTML = childSnapshots.child('score').val();
            row.classList.add('row');
            usernameCol.classList.add('col-sm-4');
            scoreCol.classList.add('col-sm-4');
            place.classList.add('col-sm-4');
            usernameCol.appendChild(username);
            scoreCol.appendChild(score);
            placeCol.appendChild(place);
            row.appendChild(placeCol);
            row.appendChild(usernameCol);
            row.appendChild(scoreCol);
            if((username.innerHTML === user.email.split("@")[0] ||
                username.displayName === username.innerHTML) &&
                parseInt(userCurrentScore) === parseInt(score.innerHTML)){
                row.style.color = "red";
            }
            board.appendChild(row);
            counter++;
        });
    });
    if (!leaderBoardOpen) {
        toggleLeaderboard();
    }
}
function addEntry(score) {
    getScores(score);
}
function signOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = "/";
    });
}