#!/usr/bin/env nodejs
var connect = require('connect');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");
var async = require('async');
var jp = require('jsonpath');
//var wrapper = require('./lib/wrapper.js');
var port = process.argv[2] || 3000;
var root = "http://localhost:" + port;
var mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// the public directory
app.use(express.static(path.join(__dirname, 'dist')));

// Routes
app.get('/', function (req, res) {
//  res.sendfile('./dist/index.html');
res.send("ok");
});

app.get('/dist/spec.json', function(req,res){
     res.sendfile(path.normalize(__dirname + '/dist/spec.json'))  

})

app.get('/code/methods/DB/:method',function(req,res){
var processData = require('./lib/processdata.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/answers";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var cursor = db.collection("items").find();
  cursor.each(function(err, doc) {
    if (err) throw err;
//    console.log("document: " + doc._id, doc);
    var objFound = processData.filterMethods(doc,req.params.method);
    console.log(objFound);

  // TODO data processing input doc elements output examples i.e. check for answers that has code with at least one accepted answer. then the code has to be 3 lines or more save the detected function calls or methods speperatly to enable easy search for later.
   
  });
//db.close();
})

res.end();
});



//Get code examples based on a given API method
app.get('/code/methods/:method_name', function(req,res){
// Look at all answers with full content
var results_file = require('./resultfile.json');
var list_results = {answers:[]};
var look_for = req.params.method_name; //the method that we are looking for


//for loop
for (var i in results_file.items){
var code = results_file.items[i]['body'];

var d = require('./lib/detectcode.js');
//find any code snippets within the text
var code1 = d.detectCode(code);
//code1 is array of code blocks

var regexp = require('./lib/detectURL.js');

// now code 1 is an array we need to look at each code block
for (var c in code1){
var r = regexp.detectRegExp(code1); //returns a JSON obj with uri and any methods detected
//console.log(JSON.stringify(r));
//JSONPATH will filter all results that uses an api identified by it's uri
var f = jp.query(r,'$.terms[?(@.uri)]');
//console.log(JSON.stringify(jp.query(r,'$.terms')));
//
console.log(f);
// f[0].uri returns the uri and position
//f[0].methods_terms returns all programming terms in the code
  //search the array for a match
  for (var item in f[0].methods_terms){
//console will log any method detected with it's position
// console.log(f[0].methods_terms[item]);
  if (look_for === f[0].methods_terms[item]){
   console.log('found ',f[0].methods_terms[item]);
//  fstr = JSON.stringify(f[0].methods_terms[item]);
   list_results.answers.push(
      {
        "found":true,
        "question_id":results_file.items[i]['question_id'],
	"answer_id":results_file.items[i]['answer_id'],
        "code":code1,
        //make sure tags works TODO recheck TODO
        "tags":results_file.items[i]['tags'],
        "content":results_file.items[i]['body']
        
      }
     )
   }
  }
//} end for loop



}
}

res.send(list_results);
});



// Get all code detected from Qs into questionscode.json
app.get('/questions/code',function(req,res){
//var results_file = require('./alltagged.json');
// TODO work on the DB instead
var fc = require('./lib/filterbodyforcodeDB.js');
var allContent = new Array();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/answers";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var cursor = db.collection("questions").find();
  cursor.each(function(err, doc) {
    if (err) throw err;
      var fdc = fc.filterResult(JSON.stringify(doc));
      var parsedFDC = JSON.parse(fdc).items;
      if (parsedFDC != '')    
       {
         console.log(fdc);
         allContent.push(fdc);
       }  
  // TODO data processing input doc elements output examples i.e. check for answers that has code with at least one accepted answer. then the code has to be 3 lines or more save the detected function calls or methods speperatly to enable easy search for later.

  });
});


res.send(allContent);
fs.writeFile("questionscode.json",allContent , 'utf8', function(err){
             if (err) throw err
             console.log('complete..')}
);
res.end();
});





// Get all code detected from answers into store
app.get('/answers/code',function(req,res){
var results_file = require('./resultfile.json');
var fc = require('./lib/filterbodyforcode.js');
var fdc = fc.filterResult(JSON.stringify(results_file));
res.send(JSON.parse(fdc));

fs.writeFile("answerscode.json", fdc, 'utf8', function(err){
          if (err) throw err
          console.log('complete..')}
);
});


// Get questions titles of specific tags
app.get('/questions/:tag/:param', function(req,res){
var a = require('./alltagged.json');
if (req.params.param === 'title' || req.params.param==='question_id'){
var txt = "$.."+ req.params.param;
var que = jp.query(a,txt);
res.send(que);
}});


// Get answers related to 100 of Qs
// TODO Remove tag, have a workflow to make sure the process starts with Qs first then with As
//===================================================
app.get('/answers/:tag',function(req,res){
  var data = require("./alltagged.json");
//DATA comes as an array each element may have 100s of qs TODO make sure you have a mechanisim to go through them all for processing
  var allQids =[];
  for (i =0; i < data.length; i++){
    var qids = getQids(data[i]);
      for (j in qids){
	allQids.push(qids[j]);
        }
     }

 // fs.writeFile('resultfile.json', '', function(){console.log('done emptying file content')});
//var ga = require('./lib/getanswers');
  var ga = require('./lib/getanswersPromise.js');

  var index1 = 0;
  while (index1 < allQids.length){
      get100 = allQids.slice(index1,index1+100);
// TODO make condition if the remaning length is greater than 100 then just add 100, if not then takes the actual remaining length

      index1 = index1+100;
    var testObj = [];
     ga.getAnswers(get100).then(function(result){
/*
   TODO  you need to make sure storing the file is json compatible, read old data and append to the obj or store in a DB right away.
 */
var myObj = JSON.parse(result);
   saveDB(myObj.items);
   testObj.push(myObj.items);
/*         
      fs.appendFile('resultfile.json', result, function (err) {
	  if (err) throw err;
	  console.log('Saved!');
          });
*/

      }).catch(function(error){
        console.log('promise rejected for QIDS ! ', error);
          });


    // var fa = require('./lib/filteransbodyforcode.js');
     // var fr = fa.filterAnswersResult(result);
     // var jsonresult2 = JSON.stringify(fr);
}






 //call readFile function to get the Qids

function getQids(data){
qids = [];
jsonobj = JSON.parse(data);
for ( var i in jsonobj.items){
//        console.log(jsonobj.items[i].question_id);
        qids[i] =jsonobj.items[i].question_id;
              }
//console.log(qids.length);
return qids;
}


//
res.send('done');
});


//Get all Qids from a given file
//==================================================


app.get('/questions/qids/',function(req,res){
var data = require('./alltagged.json');

var allqids = [];
for (i =0; i < data.length; i++){
  var qid = getQids(data[i]);
  allqids.push(qid); }

function getQids(data){
qids = [];
jsonobj = JSON.parse(data);
for ( var i in jsonobj.items){
        //console.log(jsonobj.items[i].question_id);  
        qids[qids.length] =jsonobj.items[i].question_id;
              }
//console.log(qids.length);
return qids;
}
res.send(allqids);
res.end();
});


//Get All  questions related to a specific tag 
//====================================

app.get('/questionstagged/:tag',function(req,res){


async function getAllQuestions(tag){
    var page = 1
    var res = await ta.getQuestions(tag,page);
    var r1 = JSON.parse(res);
    var hm = r1.has_more;
   // console.log(hm);
    var qr = r1.quota_remaining;
    var myObj = JSON.parse(res);
    saveQuestionstoDB(myObj.items);
 // var res = JSON.parse(res);
        //console.log('res has more',res.has_more);

    var all = [];
    all.push(res);
   //specific page numbers are needed based on an allocation for each request && page < 3
    while(hm && qr > 0){
        page++
        res=await ta.getQuestions(tag,page);
       // var res = JSON.parse(res);
        var r1 = JSON.parse(res);
        saveQuestionstoDB(r1.items);
        var hm = r1.has_more;
      //  console.log(hm);
        var qr = r1.quota_remaining;
        all.push(res);
    }
    //if there are more pages store where you've ended up with
  //  if (hm){
  //  all.page = page;
  //    }
    return all;
}



var tag = req.params.tag;
var ta = require('./lib/getquestionstagged.js');   // In production change URL to 100 pr req
getAllQuestions(tag).then(function(data){
 console.log('promise solved for ', data.length);
    //console.log(data);
    //Now we can ignore saving to a json file as we did in a DB

//  jsonresult = JSON.stringify(data);
//  fs.writeFile("alltagged.json", jsonresult, 'utf8', function(err)
 //                 {
 //                   if (err) throw err;
 //                   console.log('file saved');
 //                 });
}).catch(function(eer){
console.log('promise rejected ', eer);
});
res.send('working..');
});





// 




// TODO change the root html form and change the logic within here
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

//TODO del or change files used in the below ops
app.get('/codes', function(req, res){
var content =require('./file1.json');
res.send(JSON.parse(content));
});

app.get('/codes/:id',function(req,res){
var id = req.params.id;
var content =require('./file1.json');
console.log(id);
content = JSON.parse(content);
res.send(content["items"][id]);

});






// SaveDD function takes an obj and save it into a nonsql db
function saveDB(myobj){
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/answers";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("items").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
//    db.close();
  });
})};



function saveQuestionstoDB(myobj){
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/answers";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("questions").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    //db.close();
  });
})};











app.listen(port);
