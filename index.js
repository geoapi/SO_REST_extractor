#!/usr/bin/env nodejs
var connect = require('connect');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");

var wrapper = require('./lib/wrapper.js');
var port = process.argv[2] || 3000;
var root = "http://localhost:" + port;
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
//go fetch questions from SO API based on the query and tag provided by user
var getqs = require('./lib/getquestion.js');

for (i= 1; i < 3; i++){
   getqs.getQuestions(req.body.apiName,req.body.tag,i, function(body){
     var fc = require('./lib/filterbodyforcode.js');
     var fdc = fc.filterResult(body);
     var fqids = require('./lib/filterQIds.js');
     var qids = fqids.filterQIds(body);	
      
//     console.log(fdc);
     //storing the results as json file
      var jsonresult = JSON.stringify(fdc);
//     console.log(jsonresult); 
 //result of all code blocks in Questions
      fs.writeFile("file1.json", jsonresult, 'utf8', function(err){
        if (err) throw err; 
         console.log('complete for code in questions');
        });


//console.log("HERE ARE QIDS " + qids);

// now work on the qids to have the code out of their body content

   var ga = require('./lib/getanswers.js');
   ga.getAnswers(qids, function(err, result)
      {
      // if err throw err;// TODO handle err from err json obj

      var fa = require('./lib/filteransbodyforcode.js');
      var fr = fa.filterAnswersResult(result);
      var jsonresult2 = JSON.stringify(fr);

//     var answerscodes = fc.filterResult(qids);

     fs.writeFile("file2.json", jsonresult2, 'utf8', function(err){
         if (err) throw err; 
         console.log('complete.. for code in answers');
        });
       



       }
    ); // here comes body of all answers that belongs to the qids
//console.log("as body " + asbody);


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
