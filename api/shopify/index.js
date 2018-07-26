var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var request = require('request');
var cheerio = require('cheerio');

exports.getPage = function(req, res) {
  var embedUrl = req.query['embedUrl'];
  var url = decodeURIComponent(embedUrl);

  function sendData(data) {
    res.status(200).send(data);
  };

	var params = {
	  method: 'GET',
	  followRedirect: false,
	  followAllRedirects: true,
	  uri: 'https://bunkerbranding.com/',
	  qs: {
	    preview_theme_id: '12543787053'
	  },
	  gzip: true,
	  resolveWithFullResponse: true,
	  headers: {
	    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
	  }
	};

  request(params, function (err, res, body) {
    if (!err && res.statusCode == 200) {
    	var $ = cheerio.load(body);
    	
    	// console.log(res.headers);

    	// $('head').prepend('<base href="' + sourceUrl + '">');

    	$('head').prepend('<meta http-equiv="refresh" content="0; URL='+"'https://bunkerbranding.com/?preview_theme_id=12543787053'"+'" />');

    	var data = $.html();

      // res.status(200).send($.html());
      return sendData(data);
    } else {
      console.log(err);
    }
	});
	
	// res.merge('', {
	//   // sourceUrl: 'http://www.bbc.co.uk/news',                             // external url to fetch
	//   sourceUrl: url
	//   // sourcePlaceholder: 'div[data-entityid="container-top-stories#1"]'   // css selector to inject our content into
	// });
}