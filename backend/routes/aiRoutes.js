const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

router.use(authMiddleware);

router.post('/recommend', aiController.recommend);

module.exports = router;

