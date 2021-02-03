const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/authorCreate');
const authorList = require('../controllers/authorList');
const authorDetail = require('../controllers/authorDetail');
const authorUpdate = require('../controllers/authorUpdate');

router.get('/authors', authorList);
router.get('/authors/:id', authorDetail);
router.post('/authors', authorCreate);
router.put('/authors/:id', authorUpdate);

module.exports = router;