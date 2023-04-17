mysql = require("mysql2");
nodes = require("./nodes.js")
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

async function recover_node0(){
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
			const [results, fields] = await promisePool1.query("SELECT * from log_before1980 WHERE transaction_date > (?)", [last_transaction_date])
			allResult = allResult.concat(results)
		} catch (e) {
			console.error(e);
		}
		const promisePool2 = node_slave2.promise()
		try {
			const [results, fields] = await promisePool2.query("SELECT * from log_after1980 WHERE transaction_date > (?)", [last_transaction_date])
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
				try {
					await db.insertOneWithId(nodes.node_master, result.row_id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE"){
				try {
					await db.updateOneById(nodes.node_master, result.id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="DELETE"){
				if (result.year>=1980){
					try {
						let row = await db.selectOneById(node_slave2, id);
						await db.updateOneById(nodes.node_master, row.id, row.name, row.year, row.rating, row.genre);
					} catch (e) {
						console.error(e);
					}
				}
				if (result.year<1980){
					try {
						row = await db.selectOneById(node_slave1, id);
						await db.updateOneById(nodes.node_master, row.id, row.name, row.year, row.rating, row.genre);
					} catch (e) {
						console.error(e);
					}
				}
			}
		}
}

async function recover_node1(){
	var allResult = []
		var last_transaction_date = null
		const promisePool = node_slave1.promise()
		try {
			const [results, fields] = await promisePool.query("SELECT * from log_before1980 ORDER BY transaction_date DESC LIMIT 1")
			last_transaction_date = results[0].transaction_date
		} catch (e) {
			console.error(e);
		}
		const promisePool1 = node_master.promise()
		try {
			const [results, fields] = await promisePool1.query("SELECT * from log WHERE year < 1980 AND transaction_date > (?)", [last_transaction_date])
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
				try {
					await db.insertOneWithId(nodes.node_slave1, result.row_id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE"){
				try {
					await db.updateOneById(nodes.node_slave1, result.id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE-BEFORE1980"){
				try {
					await db.insertOneWithId(nodes.node_slave1, result.row_id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE-AFTER1980"){
				try {
					await db.deleteOneById(nodes.node_master, result.id);
				} catch (e) {
					console.error(e);
				}
				
			}
		}
}

async function recover_node2(){
	var allResult = []
		var last_transaction_date = null
		const promisePool = node_slave2.promise()
		try {
			const [results, fields] = await promisePool.query("SELECT * from log_after1980 ORDER BY transaction_date DESC LIMIT 1")
			last_transaction_date = results[0].transaction_date
		} catch (e) {
			console.error(e);
		}
		const promisePool1 = node_master.promise()
		try {
			const [results, fields] = await promisePool1.query("SELECT * from log WHERE year>=1980 AND transaction_date > (?)", [last_transaction_date])
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
				try {
					await db.insertOneWithId(nodes.node_slave2, result.row_id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE"){
				try {
					await db.updateOneById(nodes.node_slave2, result.id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE-AFTER1980"){
				try {
					await db.insertOneWithId(nodes.node_slave1, result.row_id, result.name, result.year, result.rating, result.genre);
				} catch (e) {
					console.error(e);
				}
				
			}
			else if (result.action=="UPDATE-BEFORE1980"){
				try {
					await db.deleteOneById(node.node_slave2, result.id);
				} catch (e) {
					console.error(e);
				}
				
			}
		}
}

async function recover(node_num) {
	if (node_num == 0) {
		recover_node0();
		
	}
	else if (node_num == 1){
		recover_node1();
	}
	else if (node_num == 2){
		recover_node2();
	}
}



module.exports = recover;
