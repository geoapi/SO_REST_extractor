#!/usr/bin/env nodejs
var connect = require('connect');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");

var wrapper = require('./lib/wrapper.js');
//var getqs = require('./lib/getquestion.js');
var port = process.argv[2] || 3003;
var root = "http://localhost:" + port;
//var bodyParser = require('body-parser'); deprecated
var mongoose = require('mongoose');
//var mongodb = require('mongodb').MongoClient;
//var dbConn = mongodb.connect('mongodb://localhost:27017');
//var db = dbConn.db("stackcodes");
//mongoose.connect('mongodb://localhost:27017/stackovercode');
//mongoose.model('codes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// the public directory
app.use(express.static(path.join(__dirname, 'www')));

// Routes
app.get('/', function (req, res) {
  res.sendfile('./www/index.html');
});

// the form
app.post('/',function(req, res){
//console.log(req.body.apiName);

var getqs = require('./lib/getquestion.js');

for (i= 1; i < 3; i++){
   getqs.getQuestions(req.body.apiName,req.body.tag,i, function (err, body){
     var fc = require('./lib/filterbodyforcode.js');
     var fdc = fc.filterResult(body);
//     console.log(fdc);
     //storing the results as json file
      var jsonresult = JSON.stringify(fdc);
//     console.log(jsonresult);
      fs.writeFile("file1.json", jsonresult, 'utf8', function(err){
         if (err) throw err;
         console.log('complete');
        });
    });
}
res.send('Completed successfuly');
res.end();
});


app.get('/codes', function(req, res){
fs.readFile('./file1.json', function (err, content){
 if (err) throw err;

 res.send(JSON.parse(content));
});
});

app.get('/codes/:id',function(req,res){
var id = req.params.id;
var content =require('./file1.json');
console.log(id);
content = JSON.parse(content);
res.send(content["items"][id]);

/*
var decodedObj = [{}];
decodedObj.push(
  {"tags": content["items"][id]["tags"],
   "title": content["items"][id]["title"],
   "code_blocks":content["items"][id]["codeblocks"]
}
);

res.send(decodedObj);
*/
});

app.listen(port);
