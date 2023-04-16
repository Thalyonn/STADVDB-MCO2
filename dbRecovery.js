mysql = require("mysql2");
require('dotenv').config()
db = require("./db.js")



const node_master = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST0,
	user : process.env.SQL_USERNAME0,
	password : process.env.SQL_PASSWORD0,
	database: process.env.SQL_DATABASE_LOG
});

const node_slave1 = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST1,
	user : process.env.SQL_USERNAME1,
	password : process.env.SQL_PASSWORD1,
	database: process.env.SQL_DATABASE_LOG
});

const node_slave2 = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
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
	//if not master, request the log from master
	if (node_num == 0) {
		/* TODO */
		var allResult = []
		var last_transaction_date = null
		const promisePool = node_master.promise()
		try {
			const [results, fields] = await promisePool.query("SELECT * from log ORDER BY transaction_date DESC LIMIT 1")
			last_transaction_date = results[0].transaction_date
		} catch (e) {
			console.error(e);
		}
		const promisePool1 = node_slave1.promise()
		try {
			const [results, fields] = await promisePool1.query("SELECT * from log_before1980 WHERE transaction_date < (?)", [last_transaction_date])
			allResult = allResult.concat(results)
		} catch (e) {
			console.error(e);
		}
		const promisePool2 = node_slave2.promise()
		try {
			const [results, fields] = await promisePool2.query("SELECT * from log_after1980 WHERE transaction_date < (?)", [last_transaction_date])
			allResult = allResult.concat(results)
		} catch (e) {
			console.error(e);
		}
		allResult = allResult.sort((a, b) => {
			if (a.transaction_date < b.transaction_date) {
			  return -1;
			}
		  });
		console.log(allResult)
		for(result in allResult){
			if(result.action=="INSERT"){
				await db.insertOneWithId(nodes.master, result.row_id, result.name, result.year, result.rating, result.genre);
			}
			else if (result.action=="UPDATE"){

			}
			else if (result.action=="DELETE"){

			}
		}
	}
}


recover(0);

module.exports = recover;
