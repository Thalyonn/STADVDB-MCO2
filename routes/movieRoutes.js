const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.homeView);
router.get('/create', movieController.insertMovie);
router.post('/create', movieController.insertMoviePost);

module.exports = router;