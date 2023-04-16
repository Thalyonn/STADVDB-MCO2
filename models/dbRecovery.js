db = require("db.js")

const node_master = mysql.createConnection({
	host : process.env.SQL_HOST0,
	user : process.env.SQL_USERNAME0,
	password : process.env.SQL_PASSWORD0,
	database: "log"
});

const node_slave1 = mysql.createConnection({
	host : process.env.SQL_HOST1,
	user : process.env.SQL_USERNAME1,
	password : process.env.SQL_PASSWORD1,
	database: "log"
});

const node_slave2 = mysql.createConnection({
	host : process.env.SQL_HOST2,
	user : process.env.SQL_USERNAME2,
	password : process.env.SQL_PASSWORD2,
	database: "log"
});

/* 
 * node_num: Which node am I?
 * 0: Master
 * 1: Slave (before 1980)
 * 2: Slave (after 1980)
 * */
recover: function(node_num) {
	//if not master, request the log from master
	if (node_num != 0) {
		/* TODO */
	}
}

module.exports = recover;
