mysql = require("mysql");

const db = mysql.createPool({
	connectionLimit: process.env.SQL_CONNLIMIT,
	host : process.env.SQL_HOST,
	user : process.env.SQL_USERNAME,
	password : process.env.SQL_PASSWORD,
	databse: process.env.SQL_DATABSE
});

const start_transac = "BEGIN"

const database = {
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
		db.query("SELECT * FROM node", (err, result, fields) => {
			if(err) throw err;
			return result;
		})
	},

	selectYearRange: function(start, end) {
		db.query("SELECT * FROM node WHERE year BETWEEN " + start " AND " + end, (err, result, fields) => {
			if(err) throw err;
			return result;
		}
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
		.then({} => {
			return connection.query("COMMIT")
		})
	},

	updateOne: function(id, field, value) {
		db.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id, (err, result) => {
			if(err) throw err;
			console.log(result.affectedRows + " row(s) updated");
		})
	},

	beginTransaction: function() {
		db.query("BEGIN TRANSACTION", (err, result) => {
			if(err) throw err;
			console.log("New transaction started");
		})
	},
	
	commitTransaction: function() {
		db.query("COMMIT", (err,result) => {
			if(err) throw err;
			console.log("Transaction committed"); //TODO: maybe show an ID?
		})
	},

	rollback: function() {
		db.query("ROLLBACK", (err, result) => {
			if(err) throw err;
			console.log("Rolled back to last commit");
		})
	}
}

export default database
