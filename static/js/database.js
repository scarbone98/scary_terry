/**
 * Created by scarbone on 11/12/17.
 */
let counter = 1;
let firebaseRef = firebase.database().ref('leaderboard');
let scores = [];
function getScores() {
    firebaseRef.orderByChild('negativeScore').limitToFirst(15).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshots) {
            scores.push(parseInt(childSnapshots.child('score').val()));
        });
    });
}
function initBoard() {
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
            board.appendChild(row);
            counter++;
            // scores.push(parseInt(score.innerHTML));
        });
    });
}
function addEntry(score) {
    let flag = 3;
    getScores();
    let user = firebase.auth().currentUser;
    if (parseInt(score) > parseInt(scores[scores.length - 1]) || scores.length < 15) {
        firebaseRef.child(user.uid + score).child('username').set(user.displayName).then(()=>{
            flag--;
            if(flag <= 0){
                initBoard();
                if (!leaderBoardOpen) {
                    toggleLeaderboard();
                }
            }
        });
        firebaseRef.child(user.uid + score).child('score').set(score).then(()=>{
            flag--;
            if(flag <= 0){
                initBoard();
                if (!leaderBoardOpen) {
                    toggleLeaderboard();
                }
            }
        });
        firebaseRef.child(user.uid + score).child('negativeScore').set(-1 * score).then(()=>{
            flag--;
            if(flag <= 0){
                initBoard();
                if (!leaderBoardOpen) {
                    toggleLeaderboard();
                }
            }
        });
    }
}
function signOut() {
    firebase.auth().signOut().then(()=>{
        window.location.href = "/";
    });
}