require('dotenv').load({ path: __dirname + '/.env'}); //process.env.SECRET

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
// create the app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors())
//require('./models/dummyData.model');

// Require routes
var buddy = require('./routes/buddy.route');
var category = require('./routes/category.route');
var block = require('./routes/block.route');
var appointment = require('./routes/appointment.route');
var user = require('./routes/user.route');
app.use('/buddy', buddy);
app.use('/category', category);
app.use('/block', block);
app.use('/appointment', appointment);
app.use('/user', user);

console.log(process.env.CHALLENGE)
if (process.env.CHALLENGE === 'true') {
  console.log("use chal_auth.route")
    var auth = require('./routes/chal_auth.route');
    app.use('/', auth); //webroot
}else{
  console.log("use auth.route")
    var auth = require('./routes/auth.route');
    app.use('/', auth); //webroot
}
app.listen(3000, () => {
 console.log("Server running on port 3000");
});
