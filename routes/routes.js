//creating an express app
const express = require('express');
const app = express();

//Specify Pug as the view engine for the app
const path = require('path');

//Set Publc folder via route /static
app.use('/static', express.static(path.join(__dirname, 'public')))
app.get('/favicon.ico', (req, res) => res.redirect('/static/favicon.ico'));

//Sequelize DB object typical way to get Sequelize DB object
app.set('models', require('../models'));

//Import Sequelize module to use Sequelize.Op in search action and lets us chain together logical statements
const Sequelize = require('sequelize');

app.get('/', (req, res, next) => {
    res.redirect('/books');
});

app.get('/books', (req, res, next) => {
    const Book = app.get('models').Book;

    Book.findAll()
        .then((bookList) => {
            res.render("index", {
                bookList: bookList
            });
        });
});






