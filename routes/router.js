const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/authorCreate');
const authorList = require('../controllers/authorList');
const authorDetail = require('../controllers/authorDetail');

router.get('/authors', authorList);
router.get('/authors/:id', authorDetail);
router.post('/authors', authorCreate);

module.exports = router;