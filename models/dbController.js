nodes = require("./nodes.js")
db = require("./db.js")
// performs routing of nodes depending on the year of the movie
const dbController = {
  queryAllMovies: async function() {
    let result = await db.selectAll(nodes.node_master);
    if (!result) {
      //pull from the other nodes if master is down
      let result1 = await db.selectAll(nodes.node_slave1);
      let result2 = await db.selectAll(nodes.node_slave2);
      allResults = result1.concat(result2);
      //sort the results in order
      allResults = allResults.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
      })
      result = allResults;
    }
    return await result;
  },

  queryMovieById: async function(id) {
    let result = await db.selectOneById(nodes.node_master, id);
    if (!result) {
      //query from other nodes if master is down
      let result1 = await db.selectOneById(nodes.node_slave1, id);
      if (!result1) {
        result1 = await db.selectOneById(nodes.node_slave2, id);
      }
      result = result1;
    }
    return await result;
  },

  queryMovieByName: async function(name) {
    let result = await db.selectOneByName(nodes.node_master, name);
    //query from other nodes if master is down
    if (!result) {
      let result1 = await db.selectOneByName(nodes.node_slave1, name);
      if (!result1) {
        result1 = await db.selectOneByName(nodes.node_slave2, name);
      }
      result = result1;
    }
    return await result;
  },

  insertMovie: async function(name, year, rating, genre) {
    let masterAvailable = true;
    let lastInsertId = await db.insertOne(nodes.node_master, name, year, rating, genre);
    //once again, if master is unavailable...
    if (!lastInsertId) {
      masterAvailable = false;
      let node1_highestId = await db.getHighestId(nodes.node_slave1);
      let node2_highestId = await db.getHighestId(nodes.node_slave2);
      lastInsertId = Math.max(node1_highestId, node2_highestId) + 1;

      console.log("lastInsertId: " + lastInsertId)
    }
    // if movie is released before 1980
    if (year < 1980) {
      // insert movie fields at master node and slave node 1
      await db.insertOneWithId(nodes.node_slave1, lastInsertId, name, year, rating, genre);
    }
    else {
      // insert movie fields at master node and slave node 2
      await db.insertOneWithId(nodes.node_slave2, lastInsertId, name, year, rating, genre);
    }
  },
  
  updateMovieById: async function(id, name, year, rating, genre) {
    let masterAvailable = true;
    updateId = await db.updateOneById(nodes.node_master, id, name, year, rating, genre);
    //if master is unavailable
    if (!updateId) {
      masterAvailable = false;
    }
    if (year < 1980) {
      // await db.selectOneById(nodes.node_slave2, id)
      // await db.selectOneById(nodes.node_slave1, id)
      if (await db.selectOneById(nodes.node_slave2, id)) {
        await db.insertOneWithId(nodes.node_slave1, id, name, year, rating, genre);
        await db.deleteOneById(nodes.node_slave2, id); 
      }

      else {
        await db.updateOneById(nodes.node_slave1, id, name, year, rating, genre);
      }
    }
    else {

      if (await db.selectOneById(nodes.node_slave1, id)) {
        await db.insertOneWithId(nodes.node_slave2, id, name, year, rating, genre);
        await db.deleteOneById(nodes.node_slave1, id);
      }
      else {
        await db.updateOneById(nodes.node_slave2, id, name, year, rating, genre);
      }
    }
  },

  generateReportByYearRange: async function(start, end) {
    const result = await db.generateReportByYearRange(nodes.node_master, start, end);
    return await result;
  },

  setIsolationLevel: async function(isoLevel) {
    const result = await db.setIsolationLevel(nodes.node_master, isoLevel);
    return await result;
  },

  selectIsolationLevel: async function(isoLevel) {
    const result = await db.selectIsolationLevel(nodes.node_master, isoLevel);
    return await result;
  },
};

module.exports = dbController;
