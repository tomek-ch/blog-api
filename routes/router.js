const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/authorCreate');
const authorList = require('../controllers/authorList');
const authorDetail = require('../controllers/authorDetail');
const authorUpdate = require('../controllers/authorUpdate');
const authorDelete = require('../controllers/authorDelete');

router.get('/authors', authorList);
router.get('/authors/:id', authorDetail);
router.post('/authors', authorCreate);
router.put('/authors/:id', authorUpdate);
router.delete('/authors/:id', authorDelete);

module.exports = router;