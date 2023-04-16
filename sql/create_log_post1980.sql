CREATE DATABASE IF NOT EXISTS logs;

CREATE TABLE logs.log_after1980 (
	transaction_id int NOT NULL AUTO_INCREMENT,
	transaction_date DATETIME DEFAULT NULL,
	action VARCHAR(50) DEFAULT NULL,
	row_id INT,
	name VARCHAR(100),
	year INT,
	rating FLOAT,
	genre VARCHAR(100),
    PRIMARY KEY (transaction_id)
);

USE node_after1980;
DELIMITER $$
CREATE TRIGGER movie_insert 
    AFTER INSERT 
    ON node_after1980.node FOR EACH ROW 
BEGIN
 INSERT INTO logs.log_after1980(transaction_date, action, row_id, name, year, rating, genre) 
 VALUES (NOW(), "INSERT", NEW.id, NEW.name, NEW.year, NEW.rating, NEW.genre);
END$$
DELIMITER ;

CREATE TRIGGER movie_update 
    AFTER UPDATE ON node_after1980.node
    FOR EACH ROW 
 INSERT INTO logs.log_after1980
 SET 	transaction_date=NOW(),
		action = "UPDATE",
        row_id = NEW.id,
        name = NEW.name,
        year = NEW.year,
        rating = NEW.rating,
        genre = NEW.genre;

CREATE TRIGGER movie_delete
	AFTER DELETE ON node_after1980.node
    FOR EACH ROW
 INSERT INTO logs.log_after1980
 SET 	transaction_date=NOW(),
		action = "DELETE",
        row_id = OLD.id,
        year = OLD.year,
        rating = OLD.rating,
        genre = OLD.genre;