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
 function recover(node_num) {
	if (node_num == 0) {
		const connection = node_master
	}
	else if (node_num == 1) {
		const connection = node_slave1
	}
	else {
		const connection = node_slave2
	}
	
	try {
		const [results, fields] = connection.query("SELECT * from log ORDER BY transaction_date DESC LIMIT 1")
		console.log(results)
		last_transaction_date = results[0].last_transaction_date
	} catch (e) {
		console.error(e);
	}
	//request log from other nodes
	if (node_num == 0) {
		connection1 = node_slave1
		connection2 = node_slave2
		[log1_results, log1_fields] = connection1.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date ASC", [last_transaction_date])
		console.log("Backlog from node 1: " + log1_results);
		[log2_results, log2_fields] = connection2.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date ASC", [last_transaction_date])
		console.log("Backlog from node 2: " + log2_results);
		//store in a logs array for later
		logs = [log1_results, log2_results]
	}
	//if not master node, just grab the transac info from master
	else {
		connection0 = node_master
		[log_results, log_fields] = connection0.query("SELECT * from log WHERE transaction_date > ? ORDER BY transaction_date DESC", [last_transaction_date])
		console.log("Log from node 0: " + log_results)
		//store in a logs array for later...
		logs = [log_results]
	}
	//so I don't have to violate DRY
	logs.forEach((current_log) => {
		//iterate over each log entry
		current_log.forEach((entry) => {
			//do the usual SQL blah blah blah
			connection.query("BEGIN");
			if (entry.action === "UPDATE") {
				try {
					const [entry_results, entry_fields] = connection.query("UPDATE node SET name=?, year=?, rating=?, genre=? WHERE id=?", [entry.name, entry.year, entry.rating, entry.genre, entry.row_id])
					  // await promisePool.query("DO SLEEP(10)");
					console.log(entry_results.affectedRows + " row(s) updated from log");
				} catch (e) {
					console.error(e);
				}
			}
			if (entry.action === "INSERT" {
				try {
					const entry_results = connection.query("INSERT INTO node (id, name, year, rating, genre) VALUES (?, ?, ?, ?, ?)", [entry.row_id, entry.name, entry.year, entry.rating, entry.genre]);
					console.log("Inserted a row from log");
					// console.log(results);
				} catch (e) {
					console.error(e);
				}
			}
			connection.query("COMMIT");
		})
	})
}


module.exports = recover;
