/**
 * Created by scarbone on 11/11/17.
 */
'use strict';
let Twitter = require('twitter');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let client = new Twitter({
    consumer_key: "PzaI0BIiU36o7H2l1TdvY79Is",
    consumer_secret: "DgLwjt4CgJwl0uMcghdFRs5ZYpsvCwgDalJfl8lSXnjqhOJwlI",
    access_token_key: "2460774067-bMmF1lwTE9thlKjJxVkrivCRt5V3AxGtY4i9ozX",
    access_token_secret: "mAsG2VB4vNPabpN6X8yuA0D3UL3xgnnt3lt1I3pg5uf5V"
});
app.use(bodyParser.json());
app.use('/', express.static('static'));

app.get('/', function (req, res) {

});
app.post('/twitterCall', function (req, res) {
    client.get("https://api.twitter.com/1.1/search/tweets.json?q=geology&count=10",
        [], function (error, tweets, response) {
            if (error) {
                return res.status(400).send(error);
            } else {
                let picker = Math.floor(Math.random() * 10);
                return res.status(200).send(tweets.statuses[picker].text);
            }
        });
});
let port = process.env.PORT || 8000;
app.listen(port);