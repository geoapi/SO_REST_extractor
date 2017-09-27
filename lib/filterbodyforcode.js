exports.filterResult = function(content){
var dc = require('./detectcode.js');
var detectLang = require('lang-detector');
var jsonobj = JSON.parse(content);

// require Buffer to encode code blocks , we need to avoid quotes, back slashes and tags escape using base64 encodeing/decoding

global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str).toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString();
  };
}


var fobj = {items:[]};
for ( var i in jsonobj.items){
   var codeblks = dc.detectCode(jsonobj.items[i]["body"]);
   stro = JSON.stringify(codeblks);

  // encodedcode=atob(stro);
//   console.log(encodedcode);
       // loc = ((stro.match(new RegExp("/n", "g")) || []).length); doesn't work for codes


        var detectedObj = detectLang(stro, {statistics:true});
//      console.log(detectedObj);
        if (codeblks && codeblks.length)
           {
               fobj.items.push(
              { "tags": jsonobj.items[i]["tags"],
                "question_id": jsonobj.items[i]["question_id"],
                "creation_date": jsonobj.items[i]["creation_date"],
                "extraction_date": new Date(),
//                "title":atob(jsonobj.items[i]["title"]),
		 "title":jsonobj.items[i]["title"],
                "codeblocks":stro,
                "languages":detectedObj
              }
                              );
           }
        }
return JSON.stringify(fobj);

}


