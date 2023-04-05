mysql = require("mysql");

const db = mysql.createConnection({
	host : process.env.SQL_HOST,
	user : process.env.SQL_USERNAME,
	password : process.env.SQL_PASSWORD,
});

const database = {
	db.connect((err) => {
		if(err){
			throw err;
		}
		console.log('MySql connected');
	});
}

export default database
