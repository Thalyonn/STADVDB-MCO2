require('dotenv').config()

const express = require('express');
const mysql = require('mysql');
const movieRoutes = require('./routes/movieRoutes');
const db = require('./models/db.js')

const app = express();
app.set('view engine', 'ejs');
app.listen('3000', () => {
    console.log("Server started on port 3000");
});

// movie routes
app.use('/', movieRoutes);
