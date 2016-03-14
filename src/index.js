'use strict';
var express  = require('express')
  , fs       = require('fs')
  , path     = require('path')
  , router   = express.Router()
  , log      = require('magic-log')
  , jade     = require('jade')
  //~ , blogData = require(path.join(process.cwd(), '.cache', 'blog.json'))
  , cache    = {}
;

router.get('/', function (req, res, next) {
  var S        = req.app
    , dirs     = S.get('dirs')
    , blogRoot = path.join(dirs.views, S.get('blogRoot') || 'blog')
    , template = path.join(blogRoot, 'list')
  ;
  res.render( template );
});


router.get('/tag/:tag', function (req, res, next) {
  var tag = req.params.tag;

  res.status(200).send('tag page' + tag);
});

router.get('/category/:category', function (req, res, next) {
  var category = req.params.category;
  res.status(200).send('category page' + category);
});

router.get('/:year/:month/:slug', function (req, res, next) {
  var S          = req.app
    , viewDir    = S.get('dirs').views
    , slug       = req.params.slug
    , y          = req.params.year
    , m          = req.params.month
    , blogRoot   = path.join(viewDir, S.get('blogRoot') || 'blog')
    , postPath   = path.join(blogRoot, y, m, slug)
    , layoutPath = path.join(blogRoot, 'post')
  ;
  if ( isNaN(y) || isNaN(m) ) { return next(); }

  res.render(postPath, function (err, post) {
    if ( err ) { log.error('error in magic-blog', err); return next();}
    res.render(layoutPath, {post: post}, function (err, content) {
      if ( err ) { log.error('error in magic-blog', err); return next();}
      res.status(200).send(content);
    });
  });
} );

router.get('/:year', function (req, res, next) {
  var year = req.params.year;

  if ( isNaN(year) ) { return next(); }

  log('yearly collection called', year);
  res.status(200).send('year of blog posts');
});

router.get('/:year/:month', function (req, res, next) {
  var year = req.params.year
    , month = req.params.month
  ;
  if ( isNaN(year) || isNaN(month) ) { return next(); }

  log('monthly collection called', month, year);
  res.status(200).send('month of blog posts');
});

module.exports = router;
