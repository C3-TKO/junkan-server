const express = require('express');

const router = express.Router();

// Require controller modules
const scraperController = require('../controllers/scraper');


router.get('/', (req, res) => {
  res.send(
    {
      routes: [
        '/title/:url',
        '/html/:url',
      ],
    },
  );
});

router.get('/title/:url', scraperController.get_title);

router.get('/html/:url', scraperController.get_html);

module.exports = router;
