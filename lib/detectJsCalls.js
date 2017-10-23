//exports.detectJCalls = function(code) {
var re = require("recast");
var fs = require('fs');

var tr = require("babel-traverse").default;



fs.readFile('./test.js', function (err, content){
 if (err) throw err;
var ast = re.parse(content);

tr(ast, {
enter(path){
var p = path.find(parent => parent.isCallExpression);
if (p.node.name !== undefined){
console.log(p.node.name);
}
//this works by finding two calls
//if(path.node.type === 'CallExpression') {
//console.log(path.node.type, '  ', path.node);}
},

});
});









// }
