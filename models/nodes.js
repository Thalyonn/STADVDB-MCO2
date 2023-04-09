const node0 = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST0,
	user : process.env.SQL_USERNAME0,
	password : process.env.SQL_PASSWORD0,
	database: process.env.SQL_DATABASE0
});

const node1 = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST1,
	user : process.env.SQL_USERNAME1,
	password : process.env.SQL_PASSWORD1,
	database: process.env.SQL_DATABASE1
});

const node2 = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST2,
	user : process.env.SQL_USERNAME2,
	password : process.env.SQL_PASSWORD2,
	database: process.env.SQL_DATABASE2
});

module.exports = { node0, node1, node2 };