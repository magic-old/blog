'use strict';
var express = require('express')
  , router  = express.Router()
  , path    = require('path')
  , log     = require('magic-log')
;

router.get('/blog/:postTitle', function (req, res, next) {
  log('blog postTitle', req.params.postTitle);
} );

module.exports = router;
