var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');

exports.getVideos = function(req, res){
  var userId = req.query['userId'];
  var url = 'https://www.youtube.com/user/'+userId;
  var _ph, _page, _outObj;

  function sendData(data) {
    res.status(200).send(data);
  };

  phantom.create(['--ignore-ssl-errors=yes']).then(function(ph) {
    _ph = ph;
    return _ph.createPage();
  }).then(function(page) {
    _page = page;
    return _page.open(url);
  }).then(function(status) {
    return _page.evaluate(function() {
      return document.body.innerHTML;
    });
  }).then(function(html) {
    var $ = cheerio.load(html);

    // var foo = $('ul#browse-items-primary script');
    // console.log(foo);

    console.log(html);

    var data = $('ul#browse-items-primary script').html();
    
    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
}

exports.getBanner = function(req, res){
  var userId = req.query['userId'];
  var url = 'https://www.youtube.com/user/'+userId;
  var _ph, _page, _outObj;

  function sendData(data) {
    res.status(200).send(data);
  };

  phantom.create(['--ignore-ssl-errors=yes']).then(function(ph) {
    _ph = ph;
    return _ph.createPage();
  }).then(function(page) {
    _page = page;
    return _page.open(url);
  }).then(function(status) {
    return _page.evaluate(function() {
      return document.body.innerHTML;
    });
  }).then(function(html) {
    var $ = cheerio.load(html);

    var data = $('#gh-banner')
      .html()
      .match(/\.hd-banner-image\s\{\s([\s\S]*?)\}/)[1]
      .match(/url\((.*?)\)/i)[1]
      .replace(/\,.*$/, '');
    
    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
}