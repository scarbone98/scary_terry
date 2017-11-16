/**
 * Created by scarbone on 11/12/17.
 */
let leaderBoardOpen = false;
function toggleAddEntry() {
    $("#userScoreHeader").html("You made the leaderboard with a score of " + getScore());
    $("#winnerToggle").click();
}
function toggleLeaderboard() {
    $("#leaderboardButton").click();
    leaderBoardOpen = !leaderBoardOpen;
}