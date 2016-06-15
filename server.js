#!/usr/bin/env node

var express = require("express"),
    fs = require('fs'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 4567,
    publicDir = process.argv[2] || __dirname + '/public',
    path = require('path');

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

var nutrientArr = require('./nutrient.json');
var foodArr = require('./food.json');

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, '/index.html'));
});

app.post('/save', function (req, res) {
    var updatedNutrient = req.body;

    for(var i = 0; i < nutrientArr.length; i++) {
        if(nutrientArr[i].nutrient === updatedNutrient.nutrient) {
            nutrientArr[i].value = updatedNutrient.value;
            break;
        }
    }

    fs.writeFile('nutrient.json', JSON.stringify(nutrientArr), function() {
        res.end();
    });
});

app.get("/data", function(req, res) {
  res.json({ nutrients: nutrientArr, foods: foodArr });
});

console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);
