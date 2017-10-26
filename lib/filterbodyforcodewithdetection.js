//TODO this module is not completed need more testing!
exports.filterResult = function(content){
var detectLang = require('lang-detector');
var jp = require('jsonpath');
var javaParser = require("java-parser");

const cheerio = require('cheerio');

var jsonobj = require('./resultfile.json');

//console.log(content);
//var jsonobj = JSON.parse(content);

var fobj = {items:[]};
for ( var i in jsonobj.items){

   var codeblks = [];

	var loadCode = cheerio.load(jsonobj.items[i]["body"]);
         code_block = loadCode(this).text();       
	 var stro = JSON.stringify(code_block);
	 var detectedObj = detectLang(stro, {statistics:true});
          if (detectedObj.languages["detected"] === "Java"){
               var ast = javaParser.parse(content);
               var methods = jp.query(ast, '$.types..[?(@.node=="MethodInvocation")]');
	       var keywords = jp.query(methods, '$..identifier');
        
         }

         })
	


///////////////////
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


