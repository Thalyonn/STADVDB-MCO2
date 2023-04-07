require('dotenv').config()

const express = require('express');
const mysql = require('mysql2');
const expressLayouts = require('express-ejs-layouts');
const movieRoutes = require('./routes/movieRoutes');

const db = mysql.createConnection({
    host : process.env.SQL_HOST,
    user : process.env.SQL_USERNAME,
    password : process.env.SQL_PASSWORD,
    database : process.env.SQL_DATABSE,
    port: 3306
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql connected');
});


const app = express();
const PORT = 80;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))

app.use(expressLayouts)
app.set('layout', './layouts/main')


app.listen(PORT, () => {
    console.log("Server started on port"+ 80);
});

// movie routes
app.use('/', movieRoutes);
