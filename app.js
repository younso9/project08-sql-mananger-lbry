//Importing the express app established in routes/routes.js
const app = require('./routes/routes');

//Apply our pug template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//The End - establish our server
const portNumber = 3000;
app.listen(portNumber);
console.log("App started on localhost at port " + portNumber);