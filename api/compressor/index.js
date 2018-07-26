var app         = require('../../app.js');
var url         = require('url');
var querystring = require('querystring');
var request     = require('request');
var fs          = require('fs');
var sharp       = require('sharp');

exports.getResize = function(req, res) {
  const widthString = req.query.width;
  const heightString = req.query.height;
  const format = req.query.format;
  
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

  // var stat = fs.statSync('./public/images/shutterstock.jpg');
  // res.writeHead(200, {
  //   'Content-Type' : 'image/${format || "jpg"}',
  //   'Content-Length': stat.size
  // });

  // Get the resized image
  // request('http://fromrussiawithlove.com/baby.mp3').pipe(fs.createWriteStream('song.mp3'));
  // resize('https://images.ctfassets.net/24recs06tvq2/6rsql8ItTqegCYQ64Scui8/63ebd72dde141aad7770ecb33bacc9f9/shutterstock_1051324172.jpg', format, width, height).pipe(res);
  resize('./public/images/shutterstock.jpg', format, width, height).pipe(res);
};

function resize(path, format, width, height) {
  var readStream = fs.createReadStream(path);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
};