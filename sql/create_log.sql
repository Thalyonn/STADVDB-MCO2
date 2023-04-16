CREATE DATABASE IF NOT EXISTS logs;

CREATE TABLE logs.log (
	transaction_id int NOT NULL AUTO_INCREMENT,
	transaction_date DATETIME DEFAULT NULL,
	action VARCHAR(50) DEFAULT NULL,
	row_id INT,
	name VARCHAR(100),
	year INT,
	rating FLOAT,
	genre VARCHAR(100),
    PRIMARY KEY (transaction_id)
)