exports.getQuestions = function(q,tag,page, callback){
//console.log(q + " " + tag);
var request = require('request');
var url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=100';


url = url + '&q=' + q + '&tagged='+ tag + "&page="+page;

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
//   return (body)
          });

}


