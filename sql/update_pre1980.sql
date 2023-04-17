USE node_before1980;
CREATE TRIGGER movie_delete
	AFTER DELETE ON node_before1980.node
    FOR EACH ROW
 INSERT INTO logs.log_before1980
 SET 	transaction_date=NOW(),
		action = "DELETE",
        row_id = OLD.id,
        year = OLD.year,
        rating = OLD.rating,
        genre = OLD.genre;