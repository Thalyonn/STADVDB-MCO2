

const controller = {
  homeView: function (req, res){
    res.render('index');
  },
  insertMovie: function (req, res){
    res.render('insertMovie');
  }
  
}
module.exports = controller