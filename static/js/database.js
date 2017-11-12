/**
 * Created by scarbone on 11/12/17.
 */
function addEntry() {
    let userName = "Madmax";
    let score = 299990;
    let firebaseRef = firebase.database().ref('leaderboard');
    firebaseRef.child(userName).child('score').set(score);
}