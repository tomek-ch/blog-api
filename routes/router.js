const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/author/authorCreate');
const authorList = require('../controllers/author/authorList');
const authorDetail = require('../controllers/author/authorDetail');
const authorUpdate = require('../controllers/author/authorUpdate');
const authorDelete = require('../controllers/author/authorDelete');
const postList = require('../controllers/post/postList');

router.get('/authors', authorList);
router.get('/authors/:id', authorDetail);
router.post('/authors', authorCreate);
router.put('/authors/:id', authorUpdate);
router.delete('/authors/:id', authorDelete);

router.get('/posts', postList);

module.exports = router;