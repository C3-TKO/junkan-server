"use strict"

const express = require('express');
const router = express.Router();

// Require controller modules
const scraper_controller = require('../controllers/scraper');


router.get('/', function (req, res) {
    res.send('Scraper home page')
})
router.get('/title/:url', scraper_controller.get_title);
router.get('/html/:url', scraper_controller.get_html);

module.exports = router