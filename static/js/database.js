/**
 * Created by scarbone on 11/12/17.
 */
let counter = 1;
function initBoard() {
    counter = 1;
    let firebaseRef = firebase.database().ref('leaderboard');
    let board = document.getElementById('leaderboard');
    firebaseRef.orderByChild('negativeScore').on('value', function (snapshot) {
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
            usernameCol.classList.add('col-sm-2');
            scoreCol.classList.add('col-sm-2');
            place.classList.add('col-sm-2');
            usernameCol.appendChild(username);
            scoreCol.appendChild(score);
            placeCol.appendChild(place);
            row.appendChild(placeCol);
            row.appendChild(usernameCol);
            row.appendChild(scoreCol);
            board.appendChild(row);
            counter++;
        });
    });
}
function addEntry() {
    let firebaseRef = firebase.database().ref('leaderboard');
    let userName = "Madmax";
    let score = 299990;
    let hash = Math.random() * 20000000;
    hash = Math.ceil(hash) * 17;
    hash = hash / userName.length + score;
    hash = Math.ceil(hash);
    firebaseRef.child(hash).child('username').set(userName);
    firebaseRef.child(hash).child('score').set(score);
    firebaseRef.child(hash).child('negativeScore').set(-score);
}