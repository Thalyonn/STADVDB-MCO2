CREATE DATABASE IF NOT EXISTS logs;

CREATE TABLE logs.log (
	transaction_id int NOT NULL AUTO INCREMENT,
	row_id int,
	modified_column ENUM('name', 'year', 'rating', 'genre'),
	old_value VARCHAR(100),
	new_value VARCHAR(100),
	PRIMARY KEY (transaction_id)
)
