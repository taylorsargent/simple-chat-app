'use strict';

const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const CODES         = require('../routes/utils').CODES;

const app = express();

app.use(require('compression')({ level: 9 }));
app.use(favicon(path.join(
  __dirname,
  '..',
  'public',
  'images',
  'favicon.svg'
)));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.use('/', require('../routes'));

app.use((req, res) => {
  res
    .status(CODES.NOT_FOUND)
    .sendFile(path.join(__dirname, '..', 'public', 'views', '404.html'))
});

module.exports = app;
