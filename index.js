var connect = require('connect');

var express = require('express');
var app = express();
var path = require("path");

var Datastore = require('nedb');
var db = {};
var wrapper = require('./lib/wrapper.js');
var getqs = require('./lib/getquestion.js');
var port = process.argv[2] || 3050;
var root = "http://localhost:" + port;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the public directory

app.use(express.static(path.join(__dirname, 'www')));

// Connect to an NeDB database
db.codeEg = new Datastore({ filename: 'db/codeDB', autoload: true });

// Add an index
db.codeEg.ensureIndex({ fieldName: 'title', unique: true });

// Necessary for accessing POST data via req.body object
//app.use(express.bodyParser()); //deprecated no longer possible and generates two warrnings

//app.use(connect.json());
//app.use(connect.urlencoded());
//app.use(connect.multipart());
// Catch-all route to set global values
app.use(function (req, res, next) {
    res.type('application/json');
    res.locals.wrap = wrapper.create({ start: new Date() });
    next();
});

// Routes
app.get('/', function (req, res) {
//    res.send('The API is working.');
});

// the form
app.post('/codey',function(req, res){
//	res.setHeader('Content-Type', 'application/json');
//res.send(JSON.stringify({
//			code: req.body.code || null,
//			}));
getqs.getQuestions(req.body.code, function (err, body){
res.type('application/json');
res.send(body);

res.end();
});

     
})

	//console.log('you posted: API Name: ' + req.body.code + search_so);



app.get('/code', function (req, res) {
    db.codeEg.find({}, function (err, results) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        res.json(200, res.locals.wrap({}, { item: results.map(function (code) {
            return root + '/code/' + code._id;
        })}));
    });
});

app.post('/code', function (req, res) {

    if (!req.body.title) {
        res.json(400, { error: { message: "A title is required to create a new code example." }});
        return;
    }

    db.codeEg.insert({ title: req.body.title, code : req.body.code }, function (err, created) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        res.set('Location', root + '/code/' + created._id);
        res.json(201, created);
    });
});

app.get('/code/:id', function (req, res) {
    db.codeEg.findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (!result) {
            res.json(404, { error: { message: "We did not find a code with id: " + req.params.id }});
            return;
        }

        res.json(200, res.locals.wrap(result, { self: root + '/code/' + req.params.id }));
    });
});


app.put('/code/:id', function (req, res) {
    db.codeEg.update({ _id: req.params.id }, req.body, { upsert: false }, function (err, num, upsert) {
        
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(400, { error: { message: "No records were updated." }});
            return;
        }

        res.send(204);
        res.json(200, { success: { message: "Sucessfully updated code with ID " + req.params.id }});
    });
});

app.delete('/code/:id', function (req, res) {
    db.codeEg.remove({ _id: req.params.id }, function (err, num) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(404, { error: { message: "We did not find a code with id: " + req.params.id }});
            return;
        }

        res.set('Link', root + '/code; rel="collection"');
        res.send(204);
    });
});

app.listen(port);
