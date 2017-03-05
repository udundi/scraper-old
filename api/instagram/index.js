var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');


exports.getData = function(req, res){
  var username = req.query['username'];
  console.log('-------USERNAME--------');
  console.log(username);
  var url = 'https://www.instagram.com/'+username;
  var _ph, _page, _outObj;
  var paginate = null;
  // var pages = null;
  var body = [];

  function pushData(data) {
    body.push(data);
  };

  function sendData(data) {
    // body.push(data);
    // res.status(200).send(body);
    res.status(200).send(data);
  };

  // (function pageinate(i) {
  // phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(function(ph) {
  phantom.create(['--ignore-ssl-errors=yes']).then(function(ph) {
    _ph = ph;
    return _ph.createPage();
  }).then(function(page) {
    _page = page;
    // return _page.open(url+'&page='+i);
    return _page.open(url);
  }).then(function(status) {
    return _page.evaluate(function() {
      return document.body.innerHTML;
    });
  }).then(function(html) {
    var $ = cheerio.load(html);
    var data = [];

    var imagesArr = $('img');
    $(imagesArr).each(function(i, elem) {
      var attrs = elem.attribs;
      data.push({
        'alt': attrs['alt'],
        'id': attrs['id'],
        'class': attrs['class'],
        'src': attrs['src']
      })
    });
    
    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
  // })(pages);
}