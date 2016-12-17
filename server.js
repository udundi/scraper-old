var express = require('express');
var fs      = require('fs');
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var logger  = morgan('combined');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//log all requests
// app.use(express.logger());

//support json and url encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS Values:
app.use(function(req, res, next) {
  console.log('------HEADERS-------');
  console.log(app.locals);
  console.log('------END_HEADERS-------');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/amazon/get_reviews', function(req, res){
  var merchantId = req.param('merchant_id');
  // var merchantId = 'A4FKUX0RRJ699';
  url = 'https://www.amazon.com/s?me='+merchantId;

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      
      var products = [];
      $('.s-result-item').each(function(i, elem) {
        var data = $(this);
        var dataItem = data.children().find('.s-access-detail-page');
        var dataReviews = data.children().last().children().last('a').text().split('\n\n');
        products.push({
          'id': data.attr('data-asin'),
          'handle': dataItem.attr('href').split('/')[3],
          'title': dataItem.attr('title'),
          'reviews': [{
            'totals': dataReviews[1],
            'average': dataReviews[0].trim().replace(/( out of 5 stars)/i, '')
          }]
        });
      });
    }

    // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    //   console.log('File successfully written! - Check your project directory for the output.json file');
    // })
    res.status(200).send(products);
  })
})

// app.listen('8081')
// console.log('Magic happens on port 8081');

// [START server]
// Start the server
var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
// [END server]

exports = module.exports = app;