require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser') ;
// const mysql = require('mysql2');
const expressLayouts = require('express-ejs-layouts');
const movieRoutes = require('./routes/movieRoutes');


const app = express();
const PORT = 80;
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.use(expressLayouts);
app.set('layout', './layouts/main');


app.listen(PORT, () => {
    console.log("Server started on port "+ PORT);
});

// movie routes
app.use('/', movieRoutes);