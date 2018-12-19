const express = require('express');
const bodyParser = require('body-parser');

// create the app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

//require('./models/dummyData.model');

// Require routes
var buddy = require('./routes/buddy.route');
var category = require('./routes/category.route');
var block = require('./routes/block.route');
var appointment = require('./routes/appointment.route');
app.use('/buddy', buddy);
app.use('/category', category);
app.use('/block', block);
app.use('/appointment', appointment);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
