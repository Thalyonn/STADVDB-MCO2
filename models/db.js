mysql = require("mysql2");

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

	selectAll: async function(node) { //Where "node" is a mysql2 connectionPool
		const promisePool = node.promise();
		try {
			await promisePool.query(start_transac);
			const [results, fields] = await promisePool.query("SELECT * FROM node")
			await promisePool.query("COMMIT");
		} catch (e) {
			console.error(e);
		}

		return results;
	},

	/*
	selectMovie: async function(node){
		const promisePool = node.promise();
		const [result,field ] = await promisePool.query("SELECT * FROM node");
		console.log(result)
		return result
	},
	*/

	selectYearRange: async function(node, start, end) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			const [results, fields] = await promisePool.query("SELECT * FROM node WHERE year BETWEEN " + start + " AND " + end)
			await promisePool.query("COMMIT");
		} catch (e) {;
			console.error(e);
		}
		return results;
	},

	insertOne: async function(node, name, year, rating, genres) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			await promisePool.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + genres + "')")
			console.log("Inserted a row");
			await promisePool.query("COMMIT");
		} catch (e) {
			console.error(e);
		}
	},

	updateOne: async function(node, id, field, value) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac)
			const [results, fields] = await promisePool.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id)
			console.log(results.affectedRows + " row(s) updated");
			await promisePool.query("COMMIT")
		} catch (e) {
			console.error(e);
		}

	},

	rollback: function(node) {
		node.query("ROLLBACK")
	}
}

module.exports = database;
