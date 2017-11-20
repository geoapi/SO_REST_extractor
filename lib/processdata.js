exports.filterMethods = function(docObj, look_for ){
var jp = require('jsonpath');
var code = docObj.body;

var d = require('./detectcode.js');
//find any code snippets within the text
var code1 = d.detectCode(code);
//code1 is array of code blocks
var list_results = {answers:[]};

var regexp = require('./detectURL.js');

// now code 1 is an array we need to look at each code block
for (var c in code1){
var r = regexp.detectRegExp(code1); //returns a JSON obj with uri and any methods detected
//JSONPATH will filter all results that uses an api identified by it's uri
var f = jp.query(r,'$.terms[?(@.uri)]');
//console.log(JSON.stringify(jp.query(r,'$.terms')));
//f[0].methods_terms returns all programming terms in the code
  //search the array for a match
  for (var item in f[0].methods_terms){
//console will log any method detected with it's position
// console.log(f[0].methods_terms[item]);
  if (look_for === f[0].methods_terms[item]){
   console.log('found ',f[0].methods_terms[item]);
//  fstr = JSON.stringify(f[0].methods_terms[item]);
   list_results.answers.push(
      {
        "found":true,
        "question_id":docObj.question_id,
        "answer_id":docObj.answer_id,
        "code":code1,
        //make sure tags works TODO recheck TODO
        "content":docObj.body

      }
     )
   }
  }
//} end for loop



}
return list_results; 
}

