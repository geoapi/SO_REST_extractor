exports.filterResult = function(content){
var dc = require('./detectcode.js');
var detectLang = require('lang-detector');
//console.log(content);
var jsonobj = JSON.parse(content);

var fobj = {items:[]};

   var codeblks = dc.detectCode(jsonobj.body);
   var stro = JSON.stringify(codeblks);

        var detectedObj = detectLang(stro, {statistics:true});
//      console.log(detectedObj);
        if (codeblks && codeblks.length)
           {
               fobj.items.push(
              { "tags": jsonobj.tags,
                "question_id": jsonobj.question_id,
                "creation_date": jsonobj.creation_date,
                "extraction_date": new Date(),
		 "title":jsonobj.title,
                "codeblocks":stro,
                "languages":detectedObj
              }
                              );
           }

return JSON.stringify(fobj);

}


