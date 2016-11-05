'use strict';

const router = require('express').Router();
const path = require('path');
const CODES = require('./utils').CODES;

router.get('/', (req, res, next) => {
  if (process.env.NODE_ENV !== 'development' &&
    !req.headers.host.includes(process.env.HEROKU_ADDR)) next();
  else {
    res
      .status(CODES.OK)
      .sendFile(path.join(__dirname, '..', 'public', 'views', 'index.html'));
  }
});

module.exports = router;
