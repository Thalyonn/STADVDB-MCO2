const movieDB = require("../models/db.js")
const db = require('../models/dbController')

const controller = {
  homeView: function (req, res){
    result = movieDB.selectMovie()
    console.log(result)
    res.render('index');
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

    res.redirect('/');
    // db.insertMovie(name, year, rating, genre);
  }
}
module.exports = controller