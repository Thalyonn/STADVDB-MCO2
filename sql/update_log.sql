USE node_all;
DELIMITER $$
CREATE TRIGGER movie_insert 
    AFTER INSERT 
    ON node_all.node FOR EACH ROW 
BEGIN
 INSERT INTO logs.log(transaction_date, action, row_id, name, year, rating, genre) 
 VALUES (NOW(), "INSERT", NEW.id, NEW.name, NEW.year, NEW.rating, NEW.genre);
END$$
DELIMITER ;

USE node_all;
DELIMITER $$
CREATE TRIGGER movie_update 
    AFTER UPDATE ON node_all.node
    FOR EACH ROW 
BEGIN
	IF OLD.year < 1980 AND NEW.year>=1980 THEN
		INSERT INTO logs.log
		 SET 	transaction_date=NOW(),
				action = "UPDATE-AFTER1980",
				row_id = NEW.id,
				name = NEW.name,
				year = NEW.year,
				rating = NEW.rating,
				genre = NEW.genre;
	ELSEIF OLD.year >=1980 AND NEW.year<1980 THEN
		INSERT INTO logs.log
		 SET 	transaction_date=NOW(),
				action = "UPDATE-BEFORE1980",
				row_id = NEW.id,
				name = NEW.name,
				year = NEW.year,
				rating = NEW.rating,
				genre = NEW.genre;	
	ELSE 
		 INSERT INTO logs.log
		 SET 	transaction_date=NOW(),
				action = "UPDATE",
				row_id = NEW.id,
				name = NEW.name,
				year = NEW.year,
				rating = NEW.rating,
				genre = NEW.genre;
	END IF;
END$$
DELIMITER ;