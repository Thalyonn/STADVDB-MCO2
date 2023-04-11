const movieDB = require("../models/db.js")
const db = require('../models/dbController')
const { isValidRating } = require('../helpers/validation')

const controller = {
  homeView: async function (req, res) {
    const success_msg = req.flash('success_msg');
    const result = await db.queryAllMovies();
    res.render('index', { success_msg, movies: result });
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
    console.log("name ============================================================ " + name);
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
  }
}
module.exports = controller