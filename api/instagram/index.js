var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var phantom     = require('phantom');
var cheerio     = require('cheerio');
var _           = require('underscore');

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