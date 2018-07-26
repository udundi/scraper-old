var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');
var _           = require('underscore');

exports.getUser = function(req, res) {
  var username = req.query['username'];
  // console.log('-------USERNAME--------');
  // console.log(username);
  var url = 'https://www.instagram.com/'+username;
  var _ph, _page, _outObj, _maxId;
  var body = [];

  function pushData(data){
    body.push(data);
  };

  function sendData(data) {
    body.push(data);
    res.status(200).send(_.flatten(body));
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
    // _maxId = _.last(data).id;

    // console.log(_maxId);
    
    // return pushData(data);
    return sendData(data);

  //   _page.close();
  // }).then(function() {
  //   return _page.open(url+'/?max_id='+_maxId);
  // }).then(function(status) {
  //   return _page.evaluate(function() {
  //     return document.defaultView._sharedData;
  //   });
  // }).then(function(data) {
  //   // var user = _.pluck(data.entry_data.ProfilePage, 'user');
  //   // var data = user[0]['media'].nodes;
  //   var user = data.entry_data.ProfilePage[0].graphql.user;
  //   var data = user.edge_owner_to_timeline_media.edges;
    
  //   return sendData(data);

    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });
}