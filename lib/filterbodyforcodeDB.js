exports.filterResult = function(content){
var dc = require('./detectcode.js');
var detectLang = require('lang-detector');
var sloc = require('sloc');
var jsonobj = JSON.parse(content);
var fobj = {items:[]};
   var codeblks = dc.detectCode(jsonobj.body);
   if (codeblks.length){
   var stro = JSON.stringify(codeblks);
//TODO check for code length e.g. if it's just one line or one word ignore if it's one block use it
        var detectedObj = detectLang(stro, {statistics:true});
        var sl = [];
        var lang = detectedObj.detected.toLowerCase();

       if (lang != 'unknown' && lang != 'javascript' && lang != 'ruby' && lang != 'c++'){
        for (i=0; i<codeblks.length; i++){
         sl.push(sloc(codeblks[i],lang));
           }
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
                 "sloc":sl,
                "languages":detectedObj
              });
           }
   }}// if no codeblks return empty
return JSON.stringify(fobj);
}

