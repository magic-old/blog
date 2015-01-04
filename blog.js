'use strict';
var express = require('express')
  , fs      = require('fs')
  , path    = require('path')
  , router  = express.Router()
  , log     = require('magic-log')
;

router.get('/blog/:year/:month/:title', function (req, res, next) {
  var S          = req.app
    , viewDir    = S.get('dirs').views
    , title      = req.params.title
    , year       = req.params.year
    , month      = req.params.month
    , blogPath   = path.join(viewDir, 'blog', year, month, title) 
    , layoutPath = path.join(viewDir, 'post')
  ;
  if ( isNaN(year) || isNaN(month) ) {
    return next();
  }

  res.render(blogPath, {}, function (err, post) {
    if ( err ) { log.error('error in magic-blog', err); return next();}
    res.render(layoutPath, {post: post}, function (err, content) {
      if ( err ) { log.error('error in magic-blog', err); return next();}
      res.status(status).send(content);
    });
  });
} );

router.get('/blog', function (req, res, next) {
  log('blog route called');
  res.send('blogpostlist');
});

router.get('/blog/:year', function (req, res, next) {
  var year = req.params.year;

  if ( isNaN(year) ) { return next(); }

  log('yearly collection called', year);
  res.status(status).send('year of blog posts');
});

router.get('/blog/:year/:month', function (req, res, next) {
  var year = req.params.year
    , month = req.params.month
  ;
  if ( isNaN(year) || isNaN(month) ) { return next(); }

  log('monthly collection called', month, year);
  res.send('month of blog posts');
});

router.get('/blog/tag/:tag', function (req, res, next) {
  var tag = req.params.tag;
  
  res.status(status).send('tag page', tag);
});

router.get('/blog/category/:category', function (req, res, next) {
  var category = req.params.category;
  res.status(status).send('category page', category);
});

module.exports = router;
