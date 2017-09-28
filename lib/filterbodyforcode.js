exports.filterResult = function(content){
var dc = require('./detectcode.js');
var detectLang = require('lang-detector');
var jsonobj = JSON.parse(content);

var fobj = {items:[]};
for ( var i in jsonobj.items){
   var codeblks = dc.detectCode(jsonobj.items[i]["body"]);
   var stro = JSON.stringify(codeblks);

        var detectedObj = detectLang(stro, {statistics:true});
//      console.log(detectedObj);
        if (codeblks && codeblks.length)
           {
               fobj.items.push(
              { "tags": jsonobj.items[i]["tags"],
                "question_id": jsonobj.items[i]["question_id"],
                "creation_date": jsonobj.items[i]["creation_date"],
                "extraction_date": new Date(),
		 "title":jsonobj.items[i]["title"],
                "codeblocks":stro,
                "languages":detectedObj
              }
                              );
           }
        }
return JSON.stringify(fobj);

}


