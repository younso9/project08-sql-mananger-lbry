console.log("Hello Sage");

const express = require('express');
const app = express();

const portNumber = 3000;
app.listen(portNumber);
console.log("App started on localhost at port " + portNumber);




