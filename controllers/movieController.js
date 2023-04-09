const movieDB = require("../models/db.js")

const controller = {
  homeView: function (req, res){
    result = movieDB.selectMovie()
    console.log(result)
    res.render('index');
  },
  insertMovie: function (req, res){
    res.render('insertMovie');
  }
  
}
module.exports = controller