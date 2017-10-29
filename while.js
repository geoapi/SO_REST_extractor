#!/usr/bin/env nodejs
var connect = require('connect');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");
var async = require('async');
var jp = require('jsonpath');
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



// Get all code detected from answers into file1.json
app.get('/questions/code',function(req,res){
var results_file = require('./alltagged.json');
var fc = require('./lib/filterbodyforcode.js');
var fdc = fc.filterResult(JSON.stringify(results_file));
res.send(JSON.parse(fdc));

fs.writeFile("questionscode.json", fdc, 'utf8', function(err){
             if (err) throw err
             console.log('complete..')}
);
});



// Get all code detected from answers into file1.json
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
//===================================================
app.get('/answers/:tag',function(req,res){
//var tag = req.params.tag;
data = fs.readFileSync("alltagged.json", 'utf8');
var qids = getQids(data);
get100 = qids.slice(0,100);

var ga = require('./lib/getanswers');
ga.getAnswers(get100, function(err, result)
      {
      if (err) reject(err);
      //console.log(typeof(result)); //string

      fs.writeFile("resultfile.json", result, 'utf8', function(err){
             if (err) throw err
             console.log('complete.. for code in answers')}

     // var fa = require('./lib/filteransbodyforcode.js');
     // var fr = fa.filterAnswersResult(result);
     // var jsonresult2 = JSON.stringify(fr);
        );
})



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
fs.readFile("alltagged.json", 'utf8', function(err, data)
                  {
                    if (err) throw err;
		    res.send(getQids(data));                  
                  });

function getQids(data){
qids = [];
jsonobj = JSON.parse(data);
for ( var i in jsonobj.items){
        console.log(jsonobj.items[i].question_id);  
        qids[i] =jsonobj.items[i].question_id;
              }
console.log(qids.length);
return qids;
}
});










//Get All  questions related to a specific tag 
//====================================

app.get('/tag/:id',function(req,res){


var tag = req.params.id;
//var qg = require('./lib/getquestionstagged.js');
console.log(tag);

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

var ta = require('./lib/getquestionstagged.js');   // In production change URL to 100 pr req

/*
async function getAllQuestions(tag){
    var page = 1 
    var res = JSON.parse(await ta.getQuestions(tag,page));
    var all = [res.items];
    while(res.has_more && res.quota_remaining > 0 && page<3){
        console.log('res has more',res.has_more ,'quota remaining',res.quota_remaining)
        page++
        res=JSON.parse(await ta.getQuestions(tag,page));
        all.push(res.items);
    }
    return all
}
*/
async function getAllQuestions(tag){
    var page = 1
    var res = await ta.getQuestions(tag,page);
//    console.log(res);
    var all = [res];
   //specific page numbers are needed based on an allocation for each request && page < 3
    while(res.has_more && res.quota_remaining > 0){
 //       console.log('res has more',res.has_more ,'quota remaining',res.quota_remaining)
        page++
        res=await ta.getQuestions(tag,page);
        all.push(res);
    }
    return JSON.parse(all)
}


getAllQuestions(tag).then(function(data){
console.log('promise solved');
//console.log(data);
jsonresult = JSON.stringify(data);
fs.writeFile("alltagged.json", jsonresult, 'utf8', function(err)
                  {
                    if (err) throw err;
                    console.log('file saved');
                  });


}).catch(function(eer){
console.log('promise rejected ', eer);
});

/*
function getTaggedQuestions(){

ta.getQuestions(tag,1).then(function(res){
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
*/
res.send('done');
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
app.listen(port);
