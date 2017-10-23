var request=require('request');

request.get('https://someplace',options,function(err,res,body){
  if(err) //TODO: handle err
  if(res.statusCode !== 200 ) //etc
  {}
});

