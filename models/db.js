mysql = require("mysql");

const db = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST,
	user : process.env.SQL_USERNAME,
	password : process.env.SQL_PASSWORD,
	databse: process.env.SQL_DATABSE
});

const start_transac = "BEGIN"

export const database = {
	/*
	connect: function() {
		db.connect((err) => {
			if(err){
				throw err;
			}
			console.log('MySql connected');
		});
	},
	*/ 

	selectAll: function() {
		db.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("SELECT * FROM node", (err, result, fields) => {
				if(err) throw err;
				return result;
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	selectYearRange: function(start, end) {
		db.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("SELECT * FROM node WHERE year BETWEEN " + start + " AND " + end, (err, result, fields) => {
				if(err) throw err;
				return result;
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	insertOne: function(name, year, rating, genres) {
		db.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			if(genres.isArray()){
				count = 0;
				//insert a row for each genre
				for (i in genres) {
					connection.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + i + "')", 
						(err, result) => {
							if(err) throw err;
							count++;
					});
				}
				console.log("Inserted " + count + " rows");
			}
			else {
				connection.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + genres + "')",
					(err, result) => {
					if(err) throw err;
					console.log("Inserted a row");
				});
			}
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	updateOne: function(id, field, value) {
		db.getConnection()
		.then((connection) => {
			return connection.query(start_transac)
		})
		.then(() => {
			connection.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id, (err, result) => {
				if(err) throw err;
				console.log(result.affectedRows + " row(s) updated");
			})
		})
		.then(() => {
			return connection.query("COMMIT")
		})
	},

	rollback: function() {
		db.query("ROLLBACK", (err, result) => {
			if(err) throw err;
			console.log("Rolled back to last commit");
		})
	}
}
