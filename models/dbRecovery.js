mysql = require("mysql2");
require('dotenv').config()

const node_master = mysql.createConnection({
	host : process.env.SQL_HOST0,
	user : process.env.SQL_USERNAME0,
	password : process.env.SQL_PASSWORD0,
	database: process.env.SQL_DATABASE_LOG
});

const node_slave1 = mysql.createConnection({
	host : process.env.SQL_HOST1,
	user : process.env.SQL_USERNAME1,
	password : process.env.SQL_PASSWORD1,
	database: process.env.SQL_DATABASE_LOG
});

const node_slave2 = mysql.createConnection({
	host : process.env.SQL_HOST2,
	user : process.env.SQL_USERNAME2,
	password : process.env.SQL_PASSWORD2,
	database: process.env.SQL_DATABASE_LOG
});

/* 
 * node_num: Which node am I?
 * 0: Master
 * 1: Slave (before 1980)
 * 2: Slave (after 1980)
 * */
async function recover(node_num) {
	let last_transaction_date;
	promisePool = node_master.promise() //default, because otherwise scope bullshit happens
	if (node_num == 1) {
		const promisePool = node_slave1.promise()
	}
	else if (node_num == 2) {
		const promisePool = node_slave2.promise()
	}
	
	try {
		const [results, fields] = await promisePool.query("SELECT * from log ORDER BY transaction_date DESC LIMIT 1")
		console.log(results)
		last_transaction_date = results[0].last_transaction_date
	} catch (e) {
		console.error(e);
	}
	//request log from other nodes
	if (node_num == 0) {
		promisePool1 = node_slave1.promise()
		promisePool2 = node_slave2.promise()
		const [log1_results, log1_fields] = await promisePool1.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date ASC", [last_transaction_date])
		console.log("Backlog from node 1: " + log1_results);
		const [log2_results, log2_fields] = await promisePool2.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date ASC", [last_transaction_date])
		console.log("Backlog from node 2: " + log2_results);
		//store in a logs array for later
		var logs = [log1_results, log2_results]
	}
	//if not master node, just grab the transac info from master
	else {
		promisePool0 = node_master.promise()
		const [log_results, log_fields] = await promisePool0.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date DESC", [last_transaction_date])
		console.log("Log from node 0: " + log_results)
		//store in a logs array for later...
		var logs = [log_results]
	}
	//so I don't have to violate DRY
	logs.forEach((current_log) => {
		//iterate over each log entry
		current_log.forEach(async (entry) => {
			//do the usual SQL blah blah blah
			await promisePool.query("BEGIN");
			if (entry.action === "UPDATE") {
				try {
					const [results, fields] = await promisePool.query("UPDATE node SET name=?, year=?, rating=?, genre=? WHERE id=?", [entry.name, entry.year, entry.rating, entry.genre, entry.row_id])
					  // await promisePool.query("DO SLEEP(10)");
					console.log(results.affectedRows + " row(s) updated from log");
				} catch (e) {
					console.error(e);
				}
			}
			if (entry.action === "INSERT") {
				try {
					const results = await promisePool.query("INSERT INTO node (id, name, year, rating, genre) VALUES (?, ?, ?, ?, ?)", [entry.row_id, entry.name, entry.year, entry.rating, entry.genre]);
					console.log("Inserted a row from log");
					// console.log(results);
				} catch (e) {
					console.error(e);
				}
			}
			if (entry.action === "DELETE") {
				try {
					await promisePool.query("DELETE FROM node WHERE id = ?", id);
					console.log("Deleted a row from log");
				} catch (e) {
					console.error(e)
				}
			}
				await promisePool.query("COMMIT");
		})
	})
}


module.exports = recover;
