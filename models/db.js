mysql = require("mysql");

const db = mysql.createConnection({
	host : process.env.SQL_HOST,
	user : process.env.SQL_USERNAME,
	password : process.env.SQL_PASSWORD,
});

const database = {
	connect: function() {
		db.connect((err) => {
			if(err){
				throw err;
			}
			console.log('MySql connected');
		});
	},

	selectAllFromNode: function() {
		db.query("SELECT * FROM node", (err, result, fields) => {
			if(err) throw err;
			return result;
		})
	}
}

export default database
