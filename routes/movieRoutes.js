const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/create', movieController.insertMovie);
router.get('/', movieController.homeView);
router.post('/create', movieController.insertMoviePost);
router.get('/search', movieController.searchMovieByName);
router.get('/reports', movieController.viewReports);
router.get('/generate_report', movieController.generateReport);


router.get('/:id', movieController.viewMovie);
router.get('/edit/:id', movieController.updateMovie);
router.post('/edit/:id', movieController.updateMoviePut);

module.exports = router;