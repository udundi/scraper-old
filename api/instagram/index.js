var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');
var request     = require('request');
var CronJob     = require('cron').CronJob;
var _           = require('underscore');

new CronJob('0 0 */2 * * *', function() {
  var baseUrl = 'https://udundi-theme-editor.herokuapp.com/api/shopify_api_product/getContent/';
  var url = baseUrl + 'bunker-branding-co.myshopify.com';
  var _id = '5b352f314ef7c0140084f7d5';

  function putData(data) {
    request({
      method: 'PUT',
      uri: 'https://udundi-theme-editor.herokuapp.com/api/shopify/' + _id,
      json: {config: data}
    });
    console.log('----- UPDATE THAT SHIZZ -----');
  };
  
  request(url, { json: true }, function(err, res, body) {
    if (err) { return console.log(err); }
    data = body.config;
    _.each(data.pages, function(page) {
      _.map(page.components, function(cmp) {
        if (cmp.cid === 'udtInstagramFeed') {
          var uil = 'https://udundi-scraper.herokuapp.com/instagram/getUser?username=' + cmp.username;
          request(uil, {json: true}, function(err, res, body) {
            if (err) { return console.log(err); }
            cmp.media = body;
            putData(data);
          });
        }
      });
    });
  });

  console.log('----- UPDATE INSTAGRAM FEED ------');
  // console.log('You will see this message every 5 minutes');
}, null, true, 'America/Los_Angeles');

exports.getUser = function(req, res) {
  var username = req.query['username'];
  var url = 'https://www.instagram.com/'+username;
  var _ph, _page;
  // var body = [];

  // function pushData(data){
  //   body.push(data);
  // };

  function sendData(data) {
    // body.push(data);
    // res.status(200).send(_.flatten(body));
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
      return document.defaultView._sharedData;
    });
  }).then(function(data) {
    var user = data.entry_data.ProfilePage[0].graphql.user;
    var data = user.edge_owner_to_timeline_media.edges;

    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
};

exports.getFollowers = function(req, res) {
  var username = req.query['username'];
  var url = 'https://www.instagram.com/'+username;
  var _ph, _page;

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
      return document.defaultView._sharedData;
    });
  }).then(function(data) {
    var data = data.entry_data.ProfilePage[0].graphql.user.edge_followed_by;
    
    return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
};