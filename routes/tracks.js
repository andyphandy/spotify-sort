'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../auth');

const LIMITS = [50, 100];

/**
 * Requires array of track ids.
 */
router.get('/getAudioFeatures', auth, async function(req, res) {
  let { API } = req;
  let tracks = JSON.parse(req.query.tracks);
  let total = tracks.length;
  let offset = 0;
  try {
    let fullData = [];
    while (offset < total) {
      let data = await API.getAudioFeaturesForTracks(tracks.slice(offset, offset + LIMITS[1]));
      fullData.push(...data.body.audio_features);
      offset += LIMITS[1];
    }
    res.status(200).send(fullData);
  } catch(err) {
    res.status(400).send(err);
  }
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