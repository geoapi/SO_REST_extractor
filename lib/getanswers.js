exports.getAnswers = function(qids, callback) {
//returns code blocks out of answers based on questions that has code blocks.
var request = require('request');
var str1 ='';
  for (i in qids) {
        if (i == qids.length-1) {sc = ''} else {sc =';'}
        str1 = str1 + qids[0]+ sc;
                   }
 
url1 = "https://api.stackexchange.com/2.2/questions/"
url2= "/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody&key=keqVr01zTBktmTggfO2lMg(("
url = url1 + str1 + url2;

request({
  headers: {
    'Accept': 'application/json; charset=utf-8',
    'User-Agent': 'RandomHeader'
           },
  uri: url,
  method: 'GET',
  gzip: true
         },
  function(err, res, body) {
   if (err || res.statusCode !=200){
            return callback(err || {statusCode: res.statusCode});
      }
     callback(null, body);
          });
}

