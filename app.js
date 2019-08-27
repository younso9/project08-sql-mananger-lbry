//importing the express app established in routes/routes.js
const app = require('./routes/routes');

//apply our pug template
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//establish our server
const portNumber = 3000;
app.listen(portNumber);
console.log("App started on localhost at port " + portNumber);



