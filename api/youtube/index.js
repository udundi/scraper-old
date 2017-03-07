var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');

exports.getChannel = function(req, res){
  var userId = req.query['userId'];
  // console.log('-------userId--------');
  // console.log(userId);
  var url = 'https://www.youtube.com/channel/'+userId;
  var _ph, _page, _outObj;

  function sendData(data) {
    res.status(200).send(data);
  };

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

    // console.log()

    // var imagesArr = $('img');
    // $(imagesArr).each(function(i, elem) {
    //   var attrs = elem.attribs;
    //   data.push({
    //     'alt': attrs['alt'],
    //     'id': attrs['id'],
    //     'class': attrs['class'],
    //     'src': attrs['src']
    //   })
    // });
    
    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
  // })(pages);
}