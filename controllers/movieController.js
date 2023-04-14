const movieDB = require("../models/db.js")
const db = require('../models/dbController')
const { isValidRating } = require('../helpers/validation')

const controller = {
  homeView: async function (req, res) {
    const success_msg = req.flash('success_msg');
    const result = await db.queryAllMovies();
    const currIsoLevel = await db.selectIsolationLevel();
    res.render('index', { success_msg, movies: result, currIsoLevel});
  },

  viewMovie: function(req, res) {
    const id = req.params.id;
    db.queryMovieById(id)
      .then(result => {
        res.render('viewMovie', { movie: result });
      })
      .catch(err => {
        console.log(err);
      });
  },

  searchMovieByName: function(req, res) {
    const name = req.query.name;
    const success_msg = req.flash('success_msg');
    db.queryMovieByName(name)
      .then(result => {
        console.log(result);
        res.render('index', { success_msg, movies: result });
      })
      .catch(err => {
        console.log(err);
      })
  },

  insertMovie: function (req, res){
    res.render('insertMovie');
  },

  insertMoviePost: function(req, res) {
    // validates movie fields
    // dbController call insert movie

    const name = req.body.name;
    const year = req.body.year;
    const rating = req.body.rating;
    const genre = req.body.genre;

    db.insertMovie(name, year, rating, genre);
    req.flash('success_msg', 'Movie successfully created!');
    res.redirect('/');
  },

  updateMovie: function(req, res) {
    const id = req.params.id;
    db.queryMovieById(id)
      .then(result => {
        res.render('updateMovie', { movie: result });
      })
      .catch(err => {
        console.log(err);
      });
  },

  updateMoviePut: function(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const year = req.body.year;
    const rating = req.body.rating;
    const genre = req.body.genre;

    console.log(id + name + year + rating + genre);
    db.updateMovieById(id, name, year, rating, genre);
    req.flash('success_msg', 'Movie successfully updated!');
    res.redirect('/');
  },

  viewReports: function(req, res) {
    const result = [];
    res.render('viewReport', { movies: result });
  },

  generateReport: function(req, res) {
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);

    console.log(start + end);
    db.generateReportByYearRange(start, end)
      .then(result => {
        res.render('viewReport', { movies: result });
      })
      .catch (err => {
        console.log(err);
      });
  },

  setIsolationLevel: function(req, res) {
    const isoLevel = req.body.iso_level;
    db.setIsolationLevel(isoLevel)
      .then(result => {
        req.flash('success_msg', `Isolation level ${result} has been set!`);
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);

      });
  }
}
module.exports = controller