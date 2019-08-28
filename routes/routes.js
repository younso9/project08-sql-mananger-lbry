//create an express app
const express = require('express');
const app = express();

//Specify Pug as the view engine for the app
const path = require('path');

//Set Public folder via route /static
app.use('/static', express.static(path.join(__dirname, '../public')))
app.get('/favicon.ico', (req, res) => res.redirect('/static/favicon.ico'));

//Body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Sequelize DB object typical way to get Sequelize DB object
app.set('models', require('../models'));

//Import Sequelize module to use Sequelize.Op in search action and lets us chain together logical statements
const Sequelize = require('sequelize');

app.get('/', (req, res, next) => {
    res.redirect('/books');
});

app.get('/books', (req, res, next) => {
    try {
        const Book = app.get('models').Book;

        Book.findAll()
        .then((bookList) => {
            res.render("index", {
            bookList: bookList
            });
        })
        .catch((err) => {
            res.render("error", {
                error: err
            });
        });
    }
    catch (e) {
        next(new Error('Request could not be fulfilled'));
    }
});

app.get('/books/new', (req, res, next) => {
    res.render("new-book");
});

//ROUTE: Defining post /books/new route and within it we are creating a Book (http://localhost:3000/books/new)
app.post('/books/new', (req, res, next) => {
    try {
        const Book = app.get('models').Book;
        Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
        })
        .then(() => {
            res.redirect('/books');
        })
        //handle sequelize validation error for the create new book page
        .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          res.render("new-book", {
            book: Book.build(req.body),
            errors: err.errors
          });
        }
        else
        {
          throw err;
        }
      })
      .catch((err) => {
        res.render("error", {
            error: err
          });
        });
    }
    catch (e) {
        next(new Error('Request could not be fulfilled'));
    }
});

//ROUTE: Define edit route: /books/:id (the page displayed will have "Update Book")
app.get('/books/:id', (req, res, next) => {
    try {

        const Book = app.get('models').Book;
        Book.findByPk(req.params.id)
        .then((foundBook) => {
            if (foundBook)
            {
                res.render("update-book", { id: foundBook.id, book: foundBook });
            }
            else
            {
                res.render("page-not-found");
            }
        })

        .catch((err) => {
            res.render("error", {
                error: err
            });
        });
    }
    //Renders error view in an event of an error
    catch (e) {
        next(new Error('Request could not be fulfilled'));
    }
});

app.post('/books/:id', (req, res, next) => {
    try {
    const Book = app.get('models').Book;

    Book.update({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
        },
        {where: {id: req.params.id}
        }
    )
    .then(() => {
        res.redirect('/books');
    })
    //handle sequelize validation error for the edit page
    .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          res.render("update-book", {
            book: Book.build(req.body),
            id: req.params.id,
            errors: err.errors
          });
        }
        else
        {
          throw err;
        }
      })
      .catch((err) => {
        res.render("error", {
            error: err
          });
        });  
    } 
    catch (e) {
        next(new Error('Request could not be fulfilled'));
    }    
});

//ROUTE: Define route for 'delete' book for ID = :id
app.post('/books/:id/delete', (req, res, next) => {
    try {
        const Book = app.get('models').Book;
        Book.findByPk(req.params.id)
        .then((foundBook) => {
        if (foundBook)
        {
            Book.destroy({
                where: {id: req.params.id}
            }).then(() => {
            res.redirect('/books');
            });
        }
        else
        {
            //Render 404 if the book with this :id is not found
            res.render("page-not-found");

        }
        })
        .catch((err) => {
            res.render("error", {
                error: err
            });
        });
    }
    catch (e) {
        next(new Error('Request could not be fulfilled'));
    }
});



//default route - respond to anything besides those above
app.use((req, res, next) => {
    console.log("Requested route is undefined.");
    //Page not found
    res.render("page-not-found");
  });

const newLocal = 500;
//error route: reached from any of the non-default in the
//event of an error (error handler)
app.use((err, req, res, next) => {
    console.log(err);    
    if(!res.headersSent){
        res.status(newLocal);
        res.render('error', {error: err});
}
});

module.exports = app;