const cors = require('cors')
var express = require('express');
var app = express();
const cookieparser = require('cookie-parser');
const isDevelopment = true;
require('./connectToData');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Let express know we have more files with code to handle more routes
// const carsRoutes =require('./routes/cars-routes');
// app.use('/cars', carsRoutes);

if (isDevelopment) {
    app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }))
}
function nothing() {

}

app.use('/users', require('./modules/users/users.router'));
app.use('/products', require('./modules/products/products.router'));


// Let express know we have more files with code to handle more routes
// const peopleRoutes =require('./routes/people-routes');
// app.use('/people', peopleRoutes);
// app.use('/people', require('./routes/people-routes'));


//=================================================



//=================================================


var server = app.listen(5789, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("My app is listening at http://%s:%s", host, port)
});