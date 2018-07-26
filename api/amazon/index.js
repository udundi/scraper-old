var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');


exports.getReviews = function(req, res) {
  var merchantId = req.query['merchantId'];
  console.log('-------MERCHANT-ID--------');
  var url = 'https://www.amazon.com/s?me='+merchantId;
  var _ph, _page, _outObj;
  var paginate = null;
  var pages = null;
  var body = [];

  function pushData(data){
    body.push(data);
  };

  function sendData(data){
    body.push(data);
    res.status(200).send(body);
  };

  (function pageinate(i){
    phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(function(ph){
      _ph = ph;
      return _ph.createPage();
    }).then(function(page){
      _page = page;
      return _page.open(url+'&page='+i);
    }).then(function(status){
      return _page.evaluate(function(){
        return document.getElementById('s-results-list-atf').innerHTML;
      });
    }).then(function(html){
      var $ = cheerio.load(html);
      if(pageinate == null){
        var breadcrumb = $('#main').find('#s-result-count').text();
        var limit = breadcrumb.match(/-([^\s]+)/)[1];
        var count = breadcrumb.match(/of\s([^\s]+)/)[1];
        pages = Math.ceil(count/limit);
      }
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
      if(i===null){
        i = 2;
        pageinate(i);
        return pushData(data);
      }else if(i<pages){
        pageinate(i);
        return pushData(data);
      }else{
        return sendData(data);
      }
      _page.close();
      _ph.exit();
    }).catch(function(e){
      console.log(e);
    });
  })(pages);
};