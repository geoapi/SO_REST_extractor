exports.filterQIds = function(data){
qids = [];
jsonobj = JSON.parse(data);
questions_ids_array = [];
for ( var i in jsonobj.items){
        questions_ids_array[i] =jsonobj.items[i]["question_id"];
              }
return questions_ids_array;
  }

