//exports.detectJCalls = function(code) {
var re = require("recast");
var fs = require('fs');
var tr = require("babel-traverse").default;



fs.readFile('./test2.js', function (err, content){
 if (err) throw err;
var ast = re.parse(content);
var list = [];
tr(ast, {
enter(path){
//console.log(path);
var p = path.find(parent => parent.isCallExpression);
if (p.node.name !== undefined){
list.push(p.node.name);
}
//this works by finding two calls
//if(path.node.type === 'CallExpression') {
//console.log(path.node.type, '  ', path.node);}
},
//get_uniq = list.filter(function(val,ind) { return list.indexOf(val) == ind; })
//console.log(get_uniq);
});
// eliminate all repeated keywords/words from the list. credit //https://stackoverflow.com/a/45486893/4177087

get_uniq = list.filter(function(val,ind) { return list.indexOf(val) == ind; })
console.log(get_uniq);
});









// }
