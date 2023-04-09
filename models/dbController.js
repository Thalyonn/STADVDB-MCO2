// performs routing of nodes depending on the year of the movie
const dbMaster = require('./dbMaster');
const dbSlave1 = require('./dbSlave1');
const dbSlave2 = require('./dbSlave2');

const dbController = {
  insertMovie: function(name, year, rating, genre) {
    // if movie is released before 1980
    if (year < 1980) {
      // insert movie fields at master node and slave node 1
      dbMaster.insertOne(name, year, rating, genre);
      dbSlave1.insertOne(name, year, rating, genre);
    }
    else {
      // insert movie fields at master node and slave node 2
      dbMaster.insertOne(name, year, rating, genre);
      dbSlave2.insertOne(name, year, rating, genre);
    }
  }
};

module.exports = dbController;