var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var request     = require('request');
var fs          = require('fs');
var sharp       = require('sharp');

exports.getResize = function(req, res) {
  const url = decodeURIComponent(req.query.url),
        widthString = req.query.width,
        heightString = req.query.height,
        format = req.query.format;
  
  // Parse to integer if possible
  let width, height;
  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString);
  }
  // Set the content-type of the response
  res.type('image/${format || "jpg"}');

  // Get the resized image
  // resize('https://images.ctfassets.net/24recs06tvq2/6rsql8ItTqegCYQ64Scui8/63ebd72dde141aad7770ecb33bacc9f9/shutterstock_1051324172.jpg', format, width, height).pipe(res);
  resize(url, format, width, height).pipe(res);
  // request(url).pipe(res);
  // request('http://fromrussiawithlove.com/baby.mp3').pipe(fs.createWriteStream('song.mp3'));
};

function resize(url, format, width, height) {
  // var readStream = fs.createReadStream(path);
  var params = {
    uri: url,
    gzip: true
  };

  // var readStream = request(params);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return request(params).pipe(transform);
};