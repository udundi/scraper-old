var express = require('express');
// var http    = require('http');
var fs      = require('fs');
var amazon  = require('./api/amazon');
var morgan  = require('morgan');
var parser  = require('body-parser');
var logger  = morgan('combined');
var app     = express();

//log all requests
// app.use(express.logger());

//support json and url encoded requests
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// Set CORS Values:
app.use(function(req, res, next) {
  console.log('------HEADERS-------');
  console.log(app.locals);
  console.log('------END_HEADERS-------');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.locals.ua = req.get('User-Agent');
  next();
});

// headers = {
//     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//     "Accept-Encoding": "gzip, deflate, sdch, br",
//     "Accept-Language": "en-US,en;q=0.8",
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
// }

app.get('/amazon/getReviews', amazon.getReviews);

// [START server]
// var server = app.listen(process.env.PORT || 5000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('App listening at http://localhost:'+port);
// });

var portrange = 45032;
function getPort(){
  var port = portrange;
  portrange += 1;
}

var server = app.listen(process.env.PORT || getPort(), function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://localhost:'+port);
});

// [END server]

exports = module.exports = app;