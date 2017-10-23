#!/usr/bin/env nodejs
var connect = require('connect');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");
var async = require('async');

var wrapper = require('./lib/wrapper.js');
var port = process.argv[2] || 3000;
var root = "http://localhost:" + port;
var mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// the public directory
app.use(express.static(path.join(__dirname, 'www')));

// Routes
app.get('/', function (req, res) {
  res.sendfile('./www/index.html');
});

app.get('/tag/:id',function(req,res){


var tag = req.params.id;
//var qg = require('./lib/getquestionstagged.js');


saveCodetoDB = function(data){
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/stackcodes", function (err, db) {

     if(err) throw err;

     //Write to databse Insert/Update/Query code here..
    db.collection('qcode').insert(data, function(err, record){
     if (err) throw err;
     console.log("saved!");
     })

});
}

var ta = require('./lib/getquestionstagged.js');



function getTaggedQuestions(tag, i){

ta.getQuestions(tag,1).then(function(res){
// console.log(typeof(res));
//console.log(res);
var jsonobj = JSON.parse(res);
var has_more = jsonobj.has_more;
var quota = jsonobj.quota_remaining;
var a = [];
a.push(has_more);
a.push(quota);
console.log(a);
saveCodetoDB(JSON.parse(res));
return a;
});

}

var i = 1;
do {
getTaggedQuestions(tag, i),function(err, a){
console.log(a);
}
i++;
}
while(i < 10);
res.send('done');
});








app.post('/',function(req, res){
//go fetch questions from SO API based on the query and tag provided by user
var getqs = require('./lib/getqspromised.js');

 //for (i= 1; i < 3; i++){
let i = 1
getqs.getQuestions(req.body.apiName,req.body.tag,i)
        .then(function(result){
                var fc = require('./lib/filterbodyforcode.js');
                var fdc = fc.filterResult(result);
                var fqids = require('./lib/filterQIds.js');
        	var qids = fqids.filterQIds(result);
        	var jsonresult = JSON.stringify(fdc);    
        	fs.writeFile("file1.json", jsonresult, 'utf8', function(err)
                  {
                    if (err) throw err;
         	    console.log('complete for code in questions of page: '+ i);
                  });
//               console.log(qids);
               
// answers promise
answersPromise = function(qids){
return new Promise(function(resolve, reject)
 {
  var ga = require('./lib/getanswers');
  ga.getAnswers(qids, function(err, result)
      {
      if (err) reject(err);
      var fa = require('./lib/filteransbodyforcode.js');
      var fr = fa.filterAnswersResult(result);
      var jsonresult2 = JSON.stringify(fr);
      resolve(jsonresult2);
        });
       }
    );
}


answersPromise(qids).then(function(jsonresult2){
      fs.writeFile("resultfile.json", jsonresult2, 'utf8', function(err){
      if (err) throw err
      console.log('complete.. for code in answers')});
               }).catch(function(){
                //do some error handling
      console.log("error");
             })
       });
    //  }
res.send("Done");
res.end();
})
//res.send('Completed successfuly');


app.get('/codes', function(req, res){
fs.readFile('./file1.json', function (err, content){
 if (err) throw err;
 res.send(JSON.stringify(content));
});
});

app.get('/codes/:id',function(req,res){
var id = req.params.id;
var content =require('./file1.json');
console.log(id);
content = JSON.parse(content);
res.send(content["items"][id]);

});
app.listen(port);
