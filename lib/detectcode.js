exports.detectCode = function(body) {
const cheerio = require('cheerio');
const loadedCodes = [];
const loadCode = cheerio.load(body);
loadCode('code').each(function(i, elem){
     loadedCodes[i] = loadCode(this).text();
        })
return loadedCodes}
