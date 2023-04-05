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
	},

	insertOne: function(name, year, rating, genres) {
		if(genres.isArray()){
			count = 0;
			//insert a row for each genre
			for (i in genres) {
				db.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + i + "')", 
					(err, result) => {
						if(err) throw err;
						count++;
				});
			}
			console.log("Inserted " + count + " rows");
		}
		else {
			db.query("INSERT INTO node (name, year, rating, genre) VALUES ('" + name + "', '" + year + "', '" + rating + "', '" + genres + "')", (err, result) => {
				if(err) throw err;
				console.log("Inserted a row");
			});
		}
	},

	updateOne: function(id, field, value) {
		db.query("UPDATE node SET '" + field + "' = '" + value + "' WHERE id = " + id, (err, result) => {
			if(err) throw err;
			console.log(result.affectedRows + " row(s) updated");
		})
	}
}

export default database
