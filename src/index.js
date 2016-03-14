import { Router } from 'express';
import { join } from 'path';
import log from 'magic-server-log';
import { isNumber } from 'magic-types';

const router = Router();

const noop = () => {};

router.get(
  '/',
  ({ app }, { render }, next = noop) => {
    const dirs = app.get('dirs');
    const blogRoot = join(dirs.views, app.get('blogRoot') || 'blog');
    const template = join(blogRoot, 'list');

    render(template);
  });

router.get(
  '/tag/:tag',
  ({ params }, res, next = noop) => {
    res.status(200).send(`tag page ${params.tag}`);
  });

router.get(
  '/category/:category',
  ({ params }, res, next = noop) => {
    res.status(200).send(`category page ${params.category}`);
  });

router.get(
  '/:year/:month/:slug',
  ({ app, params }, res, next = noop) => {
    const viewDir = app.get('dirs').views;
    const slug = params.slug;
    const y = params.year;
    const m = params.month;
    const blogRoot = join(viewDir, app.get('blogRoot') || 'blog');
    const postPath = join(blogRoot, y, m, slug);
    const layoutPath = join(blogRoot, 'post');

    if (!isNumber(y) || !isNumber(m)) {
      return next();
    }

    res.render(
      postPath,
      (err, post) => {
        if (err) {
          log.error('error in magic-blog', err);
          return next();
        }

        res.render(
          layoutPath,
          { post },
          (err, content) => {
            if (err) {
              log.error('error in magic-blog', err);
              return next();
            }

            res.status(200).send(content);
          });
      });
  });

router.get(
  '/:year',
  ({ params }, res, next = noop) => {
    const { year } = params;

    if (!isNumber(year)) {
      return next();
    }

    log('yearly collection called', year);
    res.status(200).send(`year of blog posts ${year}`);
  });

router.get(
  '/:year/:month',
  ({ params }, res, next = noop) => {
    const { year, month } = params;

    if (!isNumber(year) || !isNumber(month)) {
      return next();
    }

    log('monthly collection called', month, year);
    res.status(200).send(`month of blog posts ${month}/${year}`);
  });

export default router;
