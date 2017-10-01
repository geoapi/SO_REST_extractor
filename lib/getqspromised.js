exports.getQuestions = function(q,tag,page){
//console.log(q + " " + tag);
var request = require('request-promise');
var url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=100';


url = url + '&q=' + q + '&tagged='+ tag + "&page="+page;

request({headers: {
    'Accept': 'application/json; charset=utf-8',
    'User-Agent': 'RandomHeader' 
         },
     uri: url,
     method: 'GET',
     gzip: true
         })
.then((body) => console.log(body))
.catch((err)=> console.error(err));


}
