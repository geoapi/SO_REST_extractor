//exports.detectJCalls = function(code) {
//var re = require("recast");
var javaParser = require("java-parser");
var fs = require('fs');
var jp = require('jsonpath');



fs.readFile('./lib/java2.java',"utf8", function (err, content){
if (err) throw err;
//console.log(content);
//console.log(typeof(content));
var ast = javaParser.parse(content);
//console.log(ast);

//var methods = jp.query(ast, '$.types..[?(@.node=="MethodDeclaration")]');
var methods = jp.query(ast, '$.types..[?(@.node=="MethodInvocation")]');
var keywords = jp.query(methods, '$..identifier');
console.dir(keywords);
}
);
