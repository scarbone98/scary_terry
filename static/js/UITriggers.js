/**
 * Created by scarbone on 11/12/17.
 */
function toggleLeaderBoard() {
    let leaderboard = document.getElementById('leaderboard');
    if(leaderboard.style.display === 'none'){
        leaderboard.style.display = 'block';
    }
    else{
        leaderboard.style.display = 'none';
    }
}