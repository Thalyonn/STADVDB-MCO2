nodes = require("./nodes.js")
db = require("./db.js")
// performs routing of nodes depending on the year of the movie
const dbController = {
  queryAllMovies: async function() {
    const result = await db.selectAll(nodes.node_master);
    return await result;
  },

  queryMovieById: async function(id) {
    const result = await db.selectOneById(nodes.node_master, id);
    return await result;
  },

  queryMovieByName: async function(name) {
    const result = await db.selectOneByName(nodes.node_master, name);
    return await result;
  },

  insertMovie: async function(name, year, rating, genre) {
    // if movie is released before 1980
    if (year < 1980) {
      // insert movie fields at master node and slave node 1
      const lastInsertId = await db.insertOne(nodes.node_master, name, year, rating, genre);
      await db.insertOneWithId(nodes.node_slave1, lastInsertId, name, year, rating, genre);
    }
    else {
      // insert movie fields at master node and slave node 2
      const lastInsertId = await db.insertOne(nodes.node_master, name, year, rating, genre);
      await db.insertOneWithId(nodes.node_slave2, lastInsertId, name, year, rating, genre);
    }
  },

  updateMovieById: function(id, name, year, rating, genre) {
    // if movie is released before 1980 has been changed to after 1980 
    if (year < 1980) {
      // insert to slave node 1 and delete from slave node 2
      db.updateOneById(nodes.node_master, id, name, year, rating, genre);
      db.insertOneWithId(node.node_slave1, id);
      db.deleteOneById(node.node_slave2, id);
    }
    else {
      // insert to slave node 2 and delete from slave node 1
      db.updateOneById(nodes.node_master, id, name, year, rating, genre);
      db.insertOneWithId(node.node_slave2, id);
      db.deleteOneById(node.node_slave1, id);
    }
    // db.updateOneById(nodes.node_master, id, name, year, rating, genre);
  },

  generateReportByYearRange: async function(start, end) {
    const result = await db.generateReportByYearRange(nodes.node_master, start, end);
    return await result;
  },
};

module.exports = dbController;
