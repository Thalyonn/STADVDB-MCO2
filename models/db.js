mysql = require("mysql2");

const start_transac = "BEGIN"

const database = {
	selectAll: async function(node) { //Where "node" is a mysql2 connectionPool
		const promisePool = node.promise();
		try {
			await promisePool.query(start_transac);
			const [results, fields] = await promisePool.query("SELECT * FROM node LIMIT 20")
			await promisePool.query("COMMIT");
			return results;
		} catch (e) {
			console.error(e);
		}
	},

	selectOneById: async function(node, id) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac)
			const [results, fields] = await promisePool.query("SELECT * FROM node WHERE id = ?", id);
      await promisePool.query("DO SLEEP(5)");
			await promisePool.query("COMMIT");
			return await results[0];
		} catch (e) {
			console.error(e);
		}
	},

	selectOneByName: async function(node, name) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			const [results, fields] = await promisePool.query("SELECT * FROM node WHERE name = ?", name);
			await promisePool.query("COMMIT");
			return results;
		} catch (e) {
			console.error(e);
		}
	},

	generateReportByYearRange: async function(node, start, end) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			const [results, fields] = await promisePool.query("SELECT COUNT(m.id) AS count, genre, ROUND(AVG(m.rating), 1) as avg_rating, year FROM node m WHERE year BETWEEN ? AND ? GROUP BY genre, year", [start, end]);
			await promisePool.query("COMMIT");
			return results;
		} catch (e) {;
			console.error(e);
		}
	},

	insertOne: async function(node, name, year, rating, genre) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			const result = await promisePool.query("INSERT INTO node (name, year, rating, genre) VALUES (?, ?, ?, ?)", [name, year, rating, genre]);
      await promisePool.query("DO SLEEP(10)");
			console.log("Inserted a row");
			console.log(result[0]);
			await promisePool.query("COMMIT");
			console.log("insert id " + result[0].insertId);
			console.log("type " + typeof result[0].insertId);
			return result[0].insertId;
		} catch (e) {
			console.error(e);
		}
	},

	insertOneWithId: async function(node, id, name, year, rating, genre) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			const results = await promisePool.query("INSERT INTO node (id, name, year, rating, genre) VALUES (?, ?, ?, ?, ?)", [id, name, year, rating, genre]);
			console.log("Inserted a row");
			// console.log(results);
			await promisePool.query("COMMIT");
		} catch (e) {
			console.error(e);
		}
	},

	updateOneById: async function(node, id, name, year, rating, genre) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			// const [results, fields] = await promisePool.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id)
			const [results, fields] = await promisePool.query("UPDATE node SET name=?, year=?, rating=?, genre=? WHERE id=?", [name, year, rating, genre, id])
      await promisePool.query("DO SLEEP(10)");
			console.log(results.affectedRows + " row(s) updated");
			await promisePool.query("COMMIT");
		} catch (e) {
			console.error(e);
		}
	},

	rollback: function(node) {
		node.query("ROLLBACK")
	},

	deleteOneById: async function(node, id) {
		const promisePool = node.promise()
		try {
			await promisePool.query(start_transac);
			// const [results, fields] = await promisePool.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id)
			const [results, fields] = await promisePool.query("DELETE FROM node WHERE id = ?", id);
			console.log(results.affectedRows + " row(s) deleted");
			await promisePool.query("COMMIT");
		} catch (e) {
			console.error(e);
		}
	},

  setIsolationLevel: async function(node, isoLevel) {
    const promisePool = node.promise();
    try {
      await promisePool.query(`SET SESSION TRANSACTION ISOLATION LEVEL ${isoLevel}`);
      await promisePool.query("SET autocommit = 0");
      const fields = await promisePool.query("SELECT @@transaction_ISOLATION AS transaction_ISOLATION");
      return await fields[0][0].transaction_ISOLATION;
    } catch (e) {
      console.log(e);
    }
  },

  selectIsolationLevel: async function(node) {
    const promisePool = node.promise();
    try {
      const fields = await promisePool.query("SELECT @@transaction_ISOLATION AS transaction_ISOLATION");
      return await fields[0][0].transaction_ISOLATION;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = database;
