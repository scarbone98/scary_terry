/**
 * Created by scarbone on 11/14/17.
 */
function twitterCall() {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "/twitterCall",
        success: function (data) {
            $("#twitterQuote").html(data + " -Anonymous Poet");
        }
    });
}