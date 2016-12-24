var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
// var https       = require('http');
// var request     = require('request');
var cheerio     = require('cheerio');


exports.getReviews = function(req, res){
  console.time('scraper');

  var merchantId = req.query['merchantId'];
  console.log('-------MERCHANT-ID--------');
  var url = 'https://www.amazon.com/s?me='+merchantId;
  var _ph, _page, _outObj;

  phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(function(ph){
    _ph = ph;
    return _ph.createPage();
  }).then(function(page){
    _page = page;
    return _page.open(url);
  }).then(function(status){
    console.log(status);
    return _page.evaluate(function(){
      return document.getElementById('s-results-list-atf').innerHTML;
    });
  }).then(function(html){
    var $ = cheerio.load(html);
    var data = [];
    $('.s-result-item').each(function(i, elem){
      var dataItem = $(elem).children().find('.s-access-detail-page');
      var dataReviews = $(elem).children().last().children().last('a').text().split('\n\n');
      data.push({
        'id': $(elem).attr('data-asin'),
        'handle': dataItem.attr('href').split('/')[3],
        'title': dataItem.attr('title'),
        'reviews': {
          'totals': dataReviews[1],
          'average': dataReviews[0].trim().replace(/( out of 5 stars)/i, '')
        }
      });
    });
    res.status(200).send(data);
    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
    _page.close();
    _ph.exit();
  });
  console.timeEnd('scraper');
}

// exports.getReviews = function(req, res){
//   var merchantId = req.query['merchantId'];
//   console.log('-------MERCHANT-ID--------');
//   var url = 'https://www.amazon.com/s?me='+merchantId;
//   var _ph, _page, _outObj;

//   phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(function(ph){
//       _ph = ph;
//       return _ph.createPage();
//   }).then(function(page){
//       _page = page;
//       return _page.open(url);
//   }).then(function(status){
//       console.log(status);
//       return _page.property('content');
//   }).then(function(content){
//       console.log(content);
//       res.status(200).send(content);
//       _page.close();
//       _ph.exit();
//   }).catch(function(e){
//       console.log(e);
//   });
// };


// exports.getReviews = function(req, res){
//   var merchantId = req.query['merchantId'];
//   console.log('-------MERCHANT-ID--------');
//   url = 'https://www.amazon.com/s?me='+merchantId;

  // request(url, function(error, results, html){
  //   if(!error){
  //     var $ = cheerio.load(html);
      // console.time('scraper');

      // var breadcrumb = $('#main').find('#s-result-count').text();
      // var limit = breadcrumb.match(/-([^\s]+)/)[1];
      // var count = breadcrumb.match(/of\s([^\s]+)/)[1];

      // var pages = Math.ceil(count/limit);
      // console.log(pages);

      // async.map(['url1', 'url2'], function(item, callback){
      //   request(item, function (error, response, body) {
      //     callback(error, body);
      //   });
      // }, function(err, results){
      //   console.log(results);
      // });

    //   var products = [];
    //   $('.s-result-item').each(function(i, elem){
    //     var data = $(this);
    //     var dataItem = data.children().find('.s-access-detail-page');
    //     var dataReviews = data.children().last().children().last('a').text().split('\n\n');
    //     products.push({
    //       'id': data.attr('data-asin'),
    //       'handle': dataItem.attr('href').split('/')[3],
    //       'title': dataItem.attr('title'),
    //       'reviews': {
    //         'totals': dataReviews[1],
    //         'average': dataReviews[0].trim().replace(/( out of 5 stars)/i, '')
    //       }
    //     });
    //   });
    //   res.status(200).send(html);
    // }
    // res.status(400).send(error);
    // console.log('-------PRODUCTS--------');
    // console.log(products);
    
    // console.timeEnd('scraper');
  // })
// }