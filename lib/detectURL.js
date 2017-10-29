/*

This function takes regexp and a string and return the occurances that matches the reqexp in an array when the first element is the string matched a pattern and followed by the position.



*/

exports.detectRegExp= function(code){

//var detectURL = /https?:\/\/?[a-zA-Z_\\\-/]{2,}(\.[a-zA-Z_0-9\\-]{2,})+[^\s\<\>{\(\),'\"”’}:]/g; //according to RFC 7231;
//accepts end points but may get file name without args ?!
var detectURL = /https?:\/\/?[a-zA-Z_\\\-/]{2,}(\.[a-zA-Z_0-9\\-]{2,})+[^\s\<\>{\(\),'\"”’}:][\/a-zA-Z]{2,}/g;
var detectURL1 = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g
var detectHTTPVerbs = /(GET)|(HEAD)|(POST)|(PUT)|(DELETE)|(CONNECT)|(OPTIONS)|(TRACE)|(PATCH)/g;
var detectDocCommentTags = /[@][a-zA-Z]+/g;
var detectPTerms = /([\.]?[/]?\w+\.\w+\.?\w+(?:\.\w+)*)/g;

//var s = 'some text () https://api.github.com/users/google/repos some other text console.log type:\"PUT\";';



var detectRegExp = function(re,s){

var m=[];

var r=[];

do {

    m = re.exec(s);

    if (m) 

        //console.log(m[0],m['index']);

        r.push(m[0],m['index'])

    }

 while (m);

//console.log(r);

return r;

}


var {URL} = require('url');
var uri = detectRegExp(detectURL1,code);

var methods = detectRegExp(detectPTerms,code);
console.log(methods);
if (methods.length>0 && methods[0].uri !== undefined) {
 var uri_info = new URL(methods[0].uri[0]); 
} else
{ var uri_info ={};}

var b = {terms:[]};
b.terms.push(
 {
 "uri":uri,
  "uri_info":uri_info,
  "methods_terms":methods
 });
//console.log(b);


return b;

}
