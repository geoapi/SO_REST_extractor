var express = require('express');
var app = express();
var path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendfile('./www/index.html');
});


app.post('/',function(req, res){
var getqs = require('./lib/getqspromised.js');
let i = 1
getqs.getQuestions(req.body.apiName,req.body.tag,i)
        .then(function(result){
                var fc = require('./lib/filterbodyforcode.js');
                var fdc = fc.filterResult(result);
                var fqids = require('./lib/filterQIds.js');
                var qids = fqids.filterQIds(result);
                var jsonresult = JSON.stringify(fdc);
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
//console.log(jsonresults);
saveDB(jsonresult2);
});





function saveDB(myobj){
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
})};

}).catch(function(err){if (err) throw err});
res.end();
});
app.listen(3020);
