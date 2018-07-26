var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');

exports.getPage = function(req, res) {
  var embedUrl = req.query['embedUrl'];
	
	res.merge('', {
	  // sourceUrl: 'http://www.bbc.co.uk/news',                             // external url to fetch
	  sourceUrl: embedUrl
	  // sourcePlaceholder: 'div[data-entityid="container-top-stories#1"]'   // css selector to inject our content into
	});
}