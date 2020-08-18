const SpotifyWebApi = require('spotify-web-api-node');

let auth = function(req, res, next) {
  let api = new SpotifyWebApi();
  api.setAccessToken(req.headers['authorization'].split(' ')[1]);
  req.API = api;
  next();
}

module.exports = auth;