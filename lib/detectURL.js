/*

This function takes regexp and a string and return the occurances that matches the reqexp in an array when the first element is the string matched a pattern and followed by the position.



*/

exports.detectRegExp= function(code){

//var detectURL = /https?:\/\/?[a-zA-Z_\\\-/]{2,}(\.[a-zA-Z_0-9\\-]{2,})+[^\s\<\>{\(\),'\"”’}:]/g; //according to RFC 7231;
//accepts end points but may get file name without args ?!
var detectURL = /https?:\/\/?[a-zA-Z_\\\-/]{2,}(\.[a-zA-Z_0-9\\-]{2,})+[^\s\<\>{\(\),'\"”’}:][\/a-zA-Z]{2,}/g;

var detectHTTPVerbs = /(GET)|(HEAD)|(POST)|(PUT)|(DELETE)|(CONNECT)|(OPTIONS)|(TRACE)|(PATCH)/g;

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



var b = detectRegExp(detectURL,code);

//console.log(b);


return b;

}
