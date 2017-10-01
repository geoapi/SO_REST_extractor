exports.getQuestions = function(q,tag,page){
return new Promise(function(resolve, reject){

//console.log(q + " " + tag);
var request = require('request');
var url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=100';


url = url + '&q=' + q + '&tagged='+ tag + "&page="+page;

request({headers: {
    'Accept': 'application/json; charset=utf-8',
    'User-Agent': 'RandomHeader' 
         },
     uri: url,
     method: 'GET',
     gzip: true
         },
function(err, res, body) {
if (err || res.statusCode !=200){
            reject (err || {statusCode: res.statusCode});
      }
     resolve(body);
          });
})}
