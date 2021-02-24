const { Router } = require('express');
const router = Router();

const userCreate = require('../controllers/user/userCreate');
const userList = require('../controllers/user/userList');
const userDetail = require('../controllers/user/userDetail');
const userUpdate = require('../controllers/user/userUpdate');
const userDelete = require('../controllers/user/userDelete');
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
const logIn = require('../controllers/auth/logIn');

router.get('/users', userList);
router.get('/users/:id', userDetail);
router.post('/users', userCreate);
router.put('/users/:id', userUpdate);
router.delete('/users/:id', userDelete);

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

router.post('/login', logIn);

module.exports = router;