var express = require('express');
var path= require('path');
var webpack= require('webpack');
var open= require('open');
var fallback= require('express-history-api-fallback');
var bodyParser = require('body-parser');

var cards= require('./data/cards');

const isDevelopment = process.env.NODE_ENV !== "production";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, function (error) {
    if(error) {
        console.log(error);
    }
    else{
        console.log("Express server started on port: ",port);
        open(`http://localhost:${port}`);
    }
    
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// app.use(fallback('index.html', { root: __dirname }));
app.get('/details/:id', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/search/:id', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cards', function(req, res) {
    let data=[];
    for(var prop in cards){
        let obj={};
        obj.id= prop;
        obj.name=cards[prop].name;
        obj.image=cards[prop].image;
        data.push(obj);
    }
    res.send(data);
});

app.get('/cards/:id', function(req, res) {
    res.send(cards[req.params.id]);
});

app.get('/images/:path', function(req, res) {
    res.sendFile(path.join(__dirname, 'assets/images', req.params.path));
});

app.post('/cards/:id', function(req, res) {
    for(var prop in req.body){
        cards[req.params.id][prop]= req.body[prop]
    }
    res.send(true);
});

app.use(express.static(path.join(__dirname, 'dist')));
if (isDevelopment) {  
    var devConfig= require('./webpack-dev.config');

    const compiler = webpack(devConfig);

    app.use(require('webpack-dev-middleware')(compiler));

    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log
    }));
}

module.exports = app;
