/*
This file is responsible for connecting controller methods
to their corresponding routes.
 */

const controller = require('./controllers');
const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/PLACEHOLDER_1', controller.PLACEHOLDER_1.get);

router.post('/PLACEHOLDER_1', controller.PLACEHOLDER_1.post);

router.get('/PLACEHOLDER_2', controller.PLACEHOLDER_2.get);

router.post('/PLACEHOLDER_2', controller.PLACEHOLDER_2.post);

module.exports = router;
