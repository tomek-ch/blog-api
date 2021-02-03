const { Router } = require('express');
const router = Router();

const authorCreate = require('../controllers/authorCreate');
const authorList = require('../controllers/authorList');

router.get('/authors', authorList);
router.post('/authors', authorCreate);

module.exports = router;