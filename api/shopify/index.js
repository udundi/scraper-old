var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var iframeReplacement = require('../../node_modules/node-iframe-replacement/index.js');

exports.getPage = function(req, res) {
  var embedUrl = req.query['embedUrl'];
  var url = decodeURIComponent(embedUrl);
	
	res.merge('', {
	  // sourceUrl: 'http://www.bbc.co.uk/news',                             // external url to fetch
	  sourceUrl: decodeURIComponent(url)
	  // sourcePlaceholder: 'div[data-entityid="container-top-stories#1"]'   // css selector to inject our content into
	});
}