'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../auth');

require('dotenv').config();

const LIMIT = [50, 100];

const SpotifyWebApi = require('spotify-web-api-node');

let scopes = ['user-library-read', 'user-read-email', 'user-read-private',
  'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private'];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL
});

router.get('/login', function(req, res) {
  let authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

router.get('/callback', async function(req, res) {
  let { code } = req.query;
  try {
    let data = await spotifyApi.authorizationCodeGrant(code);
    res.redirect(`/#access_token=${data.body['access_token']}&refresh_token=${data.body['refresh_token']}`);
  } catch(err) {
    res.redirect('/#/error/invalid-token');
  }
});

router.get('/getMe', auth, async function(req, res) {
  let { API } = req;
  try {
    let data = await API.getMe();
    res.status(200).send(data);
  } catch(err) {
    res.status(400).send(err);
  }
});

module.exports = router;


















/*
ETC
router.get('/getSavedTracks', auth, async function(req, res) {
  let { API } = req;
  let allTracks = [];
  try {
    let offset = 0;
    let data = await API.getMySavedTracks({limit: LIMIT[0], offset: offset});
    let { items, total } = data.body;
    items.forEach((item) => {
      allTracks.push(item.track);
    });
    while (total > offset) {
      offset += LIMIT[0];
      data = await API.getMySavedTracks({limit: LIMIT[0], offset: offset});
      let { items } = data.body;
      items.forEach((item) => {
        allTracks.push(item.track);
      });
    }
    res.status(200).json({tracks: allTracks});
  } catch (err) {
    res.status(400).send(err);
  }
})

router.get('/getTrackAudioFeatures', auth, async function(req, res) {
  let { API } = req;
  let allTrackIds = JSON.parse(req.query.allTrackIds);
  let allAudioFeatures = [];
  let total = allTrackIds.length;
  if (total > 0) {
    let index = 0;
    while (index < total) {
      let search = allTracks.slice(index, index + LIMIT[1]);
      index += LIMIT[1];
      try {
        let data = await API.getAudioFeaturesForTracks(search);
        let { audio_features } = data.body;
        allAudioFeatures.concat(audio_features);
      } catch (err) {
        res.status(400).send(err);
        return;
      }
    }
  }
  res.status(200).send(validTracks);
})
*/

/*
PLAYLISTS
router.post('/createPlaylist', auth, async function(req, res) {
  let { API } = req;
  let { id, name, description } = req.body;
  try {
    if (typeof id !== 'undefined') {
      let userData = await API.getMe();
      id = userData.body.id;
    }
    let data = await API.createPlaylist(id, name, {'description': description});
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/addToPlaylist', auth, async function(req, res) {
  let { API } = req;
  let { id } = req.body;
  let trackUris = JSON.parse(req.body.trackUris);
  let uris = [];
  trackUris.forEach((uri) => {
    uris.push(uri);
  })
  let total = uris.length;
  try {
    if (total > 0) {
      let index = 0;
      while (index < total) {
        let addList = uris.slice(index, index + LIMIT[1]);
        index += LIMIT[1];
        await API.addTracksToPlaylist(id, addList);
      }
    }
  } catch (err) {
    res.status(400).send(err);
    return;
  }
  res.status(200).send();
});
*/