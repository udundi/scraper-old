var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');

exports.getPage = function(req, res) {
  var embedUrl = req.query['embedUrl'];
  var url = decodeURIComponent(embedUrl);

	res.merge('', {
	  sourceUrl: url 																												 // external url to fetch
	  // sourcePlaceholder: 'div[data-entityid="container-top-stories#1"]'   // css selector to inject our content into
	});
}