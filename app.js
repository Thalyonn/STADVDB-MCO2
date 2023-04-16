require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser') ;
const flash = require('connect-flash');
const session = require('express-session');
// const mysql = require('mysql2');
const expressLayouts = require('express-ejs-layouts');
const movieRoutes = require('./routes/movieRoutes');
const recovery = require('./models/dbRecovery.js');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.use(expressLayouts);
app.set('layout', './layouts/main');

app.use(session({
    secret:'mysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

//environment variable (don't forget to update .env)
recovery.recover(process.env.MYNODENO)

app.listen(process.env.PORT, () => {
    console.log("Server started on port "+ process.env.PORT);
});

// movie routes
app.use('/', movieRoutes);
