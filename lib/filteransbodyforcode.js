exports.filterAnswersResult = function(content){
var dc = require('./detectcode.js');
var detectLang = require('lang-detector');

var jsonobj = JSON.parse(content);
console.log(content);
var fobj = {items:[]};
for ( var i in jsonobj.items){
   var codeblks = dc.detectCode(jsonobj.items[i]["body"]);
   var stro = JSON.stringify(codeblks);
   var detectedObj = detectLang(stro, {statistics:true});
   if (codeblks && codeblks.length)
           {
             fobj.items.push(
              { 
                "answer_id":jsonobj.items[i]["answer_id"],
	        "is_accepted": jsonobj.items[i]["is_accepted"],
                "question_id": jsonobj.items[i]["question_id"],
                "creation_date": jsonobj.items[i]["creation_date"],
                "score": jsonobj.items[i]["score"],
                "extraction_date": new Date(),
                "last_activity_date":jsonobj.items[i]["last_activity_date"],
                "codeblocks":stro,
                "languages":detectedObj
              });
           }
        }
return JSON.stringify(fobj);

}


