const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/create', movieController.insertMovie);
router.get('/', movieController.homeView);
router.post('/create', movieController.insertMoviePost);
router.get('/:id', movieController.viewMovie);

module.exports = router;