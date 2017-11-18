exports.getQuestions = function(tag,page){

var request = require('request');
 var url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=100&filter=withbody&key=keqVr01zTBktmTggfO2lMg((';

url = url + '&tagged='+ tag + "&page="+page;

request({headers: {
    'Accept': 'application/json; charset=utf-8',
    'User-Agent': 'RandomHeader'
         },
     uri: url,
     method: 'GET',
     gzip: true
         },
function(err, res, body) {
if (err){
           return (err);
      }else
     return(body);
          });
}
      
