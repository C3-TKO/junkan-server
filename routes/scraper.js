"use strict"

const express = require('express');
const router = express.Router();

// Require controller modules
const scraper_controller = require('../controllers/scraper');

// Home page route
router.get('/title', scraper_controller.get_title);

// About page route
router.get('/html', scraper_controller.get_html);

module.exports = router