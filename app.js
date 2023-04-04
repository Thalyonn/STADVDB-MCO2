const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : ''
});
//connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql connected');
});

const app = express();

app.listen('3000', () => {
    console.log("Server started on port 3000");
});