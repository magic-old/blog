'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _path = require('path');

var _magicServerLog = require('magic-server-log');

var _magicServerLog2 = _interopRequireDefault(_magicServerLog);

var _magicTypes = require('magic-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

var noop = function noop() {};

router.get('/', function (_ref, _ref2) {
  var app = _ref.app;
  var render = _ref2.render;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  var dirs = app.get('dirs');
  var blogRoot = (0, _path.join)(dirs.views, app.get('blogRoot') || 'blog');
  var template = (0, _path.join)(blogRoot, 'list');

  render(template);
});

router.get('/tag/:tag', function (_ref3, _ref4) {
  var params = _ref3.params;
  var status = _ref4.status;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  status(200).send('tag page ' + params.tag);
});

router.get('/category/:category', function (_ref5, _ref6) {
  var params = _ref5.params;
  var status = _ref6.status;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  status(200).send('category page ' + params.category);
});

router.get('/:year/:month/:slug', function (_ref7, _ref8) {
  var app = _ref7.app;
  var params = _ref7.params;
  var render = _ref8.render;
  var status = _ref8.status;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  var viewDir = app.get('dirs').views;
  var slug = params.slug;
  var y = params.year;
  var m = params.month;
  var blogRoot = (0, _path.join)(viewDir, app.get('blogRoot') || 'blog');
  var postPath = (0, _path.join)(blogRoot, y, m, slug);
  var layoutPath = (0, _path.join)(blogRoot, 'post');

  if (!(0, _magicTypes.isNumber)(y) || !(0, _magicTypes.isNumber)(m)) {
    return next();
  }

  render(postPath, function (err, post) {
    if (err) {
      _magicServerLog2.default.error('error in magic-blog', err);
      return next();
    }

    render(layoutPath, { post: post }, function (err, content) {
      if (err) {
        _magicServerLog2.default.error('error in magic-blog', err);
        return next();
      }

      status(200).send(content);
    });
  });
});

router.get('/:year', function (_ref9, _ref10) {
  var params = _ref9.params;
  var status = _ref10.status;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];
  var year = params.year;


  if (!(0, _magicTypes.isNumber)(year)) {
    return next();
  }

  (0, _magicServerLog2.default)('yearly collection called', year);
  status(200).send('year of blog posts ' + year);
});

router.get('/:year/:month', function (_ref11, _ref12) {
  var params = _ref11.params;
  var status = _ref12.status;
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];
  var year = params.year;
  var month = params.month;


  if (!(0, _magicTypes.isNumber)(year) || !(0, _magicTypes.isNumber)(month)) {
    return next();
  }

  (0, _magicServerLog2.default)('monthly collection called', month, year);
  status(200).send('month of blog posts ' + month + '/' + year);
});

exports.default = router;

//# sourceMappingURL=index.js.map