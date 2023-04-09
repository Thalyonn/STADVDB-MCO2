mysql = require("mysql2");

nodes = require("./nodes.js");

const start_transac = "BEGIN"

const database = {
	/*
	connect: function() {
		node.connect((err) => {
			if(err){
				throw err;
			}
			console.log('MySql connected');
		});
	},
	*/ 

	selectAll: function(node) {
		node.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("SELECT * FROM node", (err, result, fields) => {
				if(err) throw err;
				return result;
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},
	selectMovie: async function(node){
		const promisePool = node.promise();
		const [result,field ] = await promisePool.query("SELECT * FROM node");
		node.end();
		console.log(result)
		return result
	},

	selectYearRange: function(node, start, end) {
		node.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("SELECT * FROM node WHERE year BETWEEN " + start + " AND " + end, (err, result, fields) => {
				if(err) throw err;
				return result;
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	insertOne: function(node, name, year, rating, genres) {
		node.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			if(genres.isArray()){
				count = 0;
				//insert a row for each genre
				for (i in genres) {
					connection.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + i + "')", 
						(err, result) => {
							if(err) throw err;
							count++;
					});
				}
				console.log("Inserted " + count + " rows");
			}
			else {
				connection.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + genres + "')",
					(err, result) => {
					if(err) throw err;
					console.log("Inserted a row");
				});
			}
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	updateOne: function(node, id, field, value) {
		node.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id, (err, result) => {
				if(err) throw err;
				console.log(result.affectedRows + " row(s) updated");
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	rollback: function(node) {
		node.query("ROLLBACK", (err, result) => {
			if(err) throw err;
			console.log("Rolled back to last commit");
		})
	}
}

module.exports = database;
