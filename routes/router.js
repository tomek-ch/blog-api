const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/author/authorCreate');
const authorList = require('../controllers/author/authorList');
const authorDetail = require('../controllers/author/authorDetail');
const authorUpdate = require('../controllers/author/authorUpdate');
const authorDelete = require('../controllers/author/authorDelete');
const postList = require('../controllers/post/postList');
const postDetail = require('../controllers/post/postDetail');
const postCreate = require('../controllers/post/postCreate');
const postUpdate = require('../controllers/post/postUpdate');
const postDelete = require('../controllers/post/postDelete');
const commentList = require('../controllers/comment/commentList');
const commentCreate = require('../controllers/comment/commentCreate');
const commentDetail = require('../controllers/comment/commentDetail');
const commentUpdate = require('../controllers/comment/commentUpdate');
const commentDelete = require('../controllers/comment/commentDelete');

router.get('/authors', authorList);
router.get('/authors/:id', authorDetail);
router.post('/authors', authorCreate);
router.put('/authors/:id', authorUpdate);
router.delete('/authors/:id', authorDelete);

router.get('/posts', postList);
router.get('/posts/:id', postDetail);
router.post('/posts', postCreate);
router.put('/posts/:id', postUpdate);
router.delete('/posts/:id', postDelete);

router.get('/comments', commentList);
router.get('/comments/:id', commentDetail);
router.post('/comments', commentCreate);
router.put('/comments/:id', commentUpdate);
router.delete('/comments/:id', commentDelete);

module.exports = router;