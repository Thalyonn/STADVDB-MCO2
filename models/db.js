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

	selectAll: function() {
		db.query("SELECT * FROM node", (err, result, fields) => {
			if(err) throw err;
			return result;
		})
	}

	updateOne: function(id, field, value) {
		db.query("UPDATE node SET " + field + " = " + value + " WHERE id = " + id, (err, result) => {
			if(err) throw err;
			console.log(result.affectedRows + " row(s) updated");
		})
	}
}

export default database
