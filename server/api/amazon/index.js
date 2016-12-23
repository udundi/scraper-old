var app         = require('../../../app.js');
var url         = require('url');
var querystring = require('querystring');
var request     = require('request');
var cheerio     = require('cheerio');
var scriptAdded = false;

// var app          = require('../../../app.js');
// var url          = require('url');
// var querystring = require('querystring');
// var fs           = require('fs');
// var async        = require('async');
// var request      = require('request');
// var cheerio      = require('cheerio');


exports.getReviews = function(req, res){
  var merchantId = req.query['merchantId'];
  url = 'https://www.amazon.com/s?me='+merchantId;

  request(url, function(error, results, html){
    if(!error){
      var $ = cheerio.load(html);
      console.time('scraper');
      var products = [];
      $('.s-result-item').each(function(i, elem){
        var data = $(this);
        var dataItem = data.children().find('.s-access-detail-page');
        var dataReviews = data.children().last().children().last('a').text().split('\n\n');
        products.push({
          'id': data.attr('data-asin'),
          'handle': dataItem.attr('href').split('/')[3],
          'title': dataItem.attr('title'),
          'reviews': {
            'totals': dataReviews[1],
            'average': dataReviews[0].trim().replace(/( out of 5 stars)/i, '')
          }
        });
      });
    }
    res.status(200).send(products);
    console.timeEnd('scraper');
  })
}

// exports.getReviews = function(req, res){
//   var merchantId = req.query['merchantId'];
//   url = 'https://www.amazon.com/s?me='+merchantId;
//   // url2 = url+'&page=2';

//   request(url, function(error, results, html){
//     if(!error){
//       var $ = cheerio.load(html);
      
//       // var breadcrumb = $('#main').find('#s-result-count').text();
//       // var limit = breadcrumb.match(/-([^\s]+)/)[1];
//       // var count = breadcrumb.match(/of\s([^\s]+)/)[1];

//       // var pages = Math.ceil(count/limit);
//       // console.log(pages);

//       var products = [];
//       $('.s-result-item').each(function(i, elem){
//         var data = $(this);
//         var dataItem = data.children().find('.s-access-detail-page');
//         var dataReviews = data.children().last().children().last('a').text().split('\n\n');
//         products.push({
//           'id': data.attr('data-asin'),
//           'handle': dataItem.attr('href').split('/')[3],
//           'title': dataItem.attr('title'),
//           'reviews': {
//             'totals': dataReviews[1],
//             'average': dataReviews[0].trim().replace(/( out of 5 stars)/i, '')
//           }
//         });
//       });
//     }
//     res.status(200).send(products);
//   })
// }

// async.map(['url1', 'url2'], function(item, callback){
//   request(item, function (error, response, body) {
//     callback(error, body);
//   });
// }, function(err, results){
//   console.log(results);
// });