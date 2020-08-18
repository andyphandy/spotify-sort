'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../auth');

const LIMITS = [50, 100];

/**
 * Requires user id.
 */
router.get('/getUserPlaylists', auth, async function(req, res) {
  let { API } = req;
  try {
    let fullData = [];
    let data = await API.getUserPlaylists({limit: LIMITS[0]});
    fullData.push(...data.body.items);
    let { total } = data.body;
    let offset = LIMITS[0];
    while (offset < total) {
      data = await API.getUserPlaylists({limit: LIMITS[0], offset: offset});
      fullData.push(...data.body.items);
      offset += LIMITS[0];
    }
    res.status(200).send(fullData);
  } catch(err) {
    res.status(400).send(err);
  }
});

/**
 * Requires playlist id.
 */
router.get('/getPlaylist', auth, async function(req, res) {
  let { API } = req;
  let { playlistId } = req.query;
  try {
    let data = await API.getPlaylist(playlistId);
    res.status(200).send(data);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/getPlaylistTracks', auth, async function(req, res) {
  let { API } = req;
  let { playlistId } = req.query;
  try {
    let fullData = [];
    let data = await API.getPlaylistTracks(playlistId, {limit: LIMITS[0]});
    fullData.push(...data.body.items);
    let { total } = data.body;
    let offset = LIMITS[0];
    while (offset < total) {
      data = await API.getPlaylistTracks(playlistId, {limit: LIMITS[0], offset: offset});
      fullData.push(...data.body.items);
      offset += LIMITS[0];
    }
    res.status(200).send(fullData);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.post('/createPlaylist', auth, async function (req, res) {
  let { API } = req;
  let { id } = req.body;
  try {
    let data = await API.createPlaylist(id, 'New Playlist', { public: false });
    res.status(200).send(data);
  }
  catch (err) {
    res.status(400).send(err);
  }
})

router.post('/addToPlaylist', auth, async function(req, res) {
  let { API } = req;
  let { id } = req.body;
  let trackUris = JSON.parse(req.body.trackUris);
  console.log(trackUris)
  let total = trackUris.length;
  try {
    if (total > 0) {
      let index = 0;
      while (index < total) {
        let addList = trackUris.slice(index, index + LIMITS[1]);
        index += LIMITS[1];
        await API.addTracksToPlaylist(id, addList);
      }
    }
  } catch (err) {
    res.status(400).send(err);
    return;
  }
  res.status(200).send();
});

module.exports = router;

/*
router.get('/', auth, async function(req, res) {
  let { API } = req;
  try {
    let data = await API
    res.status(200).send(data);
  } catch(err) {
    res.status(400).send(err);
  }
});
*/