require('dotenv').config()

const express = require('express');
const mysql = require('mysql');
const movieRoutes = require('./routes/movieRoutes');
const db = require('./models/db.js')

const app = express();
const PORT = 3000 || process.env.PORT;
app.set('view engine', 'ejs');
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

// movie routes
app.use('/', movieRoutes);
