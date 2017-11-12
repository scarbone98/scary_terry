/**
 * Created by scarbone on 11/11/17.
 */
'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use('/',express.static('static'));

app.get('/', function (req, res) {

});

let port = process.env.PORT || 8000;
app.listen(port);