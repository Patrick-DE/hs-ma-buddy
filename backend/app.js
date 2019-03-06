if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = 'dev';
const fs = require('fs');
const path = require('path');
checkConfigfile();
require('dotenv').load({ path: __dirname + '/.env' }); //process.env.SECRET

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const cookieParser = require('cookie-parser')
// create the app
const app = express();

if(process.env.NODE_ENV === "production"){
	console.log = function(error){
		fs.appendFileSync("tmp/LogMe.txt", error);
	};
}
console.log(process.env.NODE_ENV);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cookieParser())
//app.use(cors({origin: true, credentials: true}))

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

var auth = require('./routes/auth.route');
app.use('/', auth); //webroot

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
	console.log("Server running on port 3000");
});


function checkConfigfile() {
	const envPath = path.join(__dirname, '.env');
	if (!fs.existsSync(envPath)) {
		console.log("==========================================================")
		console.log("!!!!!!!!!!!!!!! The '.env' file is missing !!!!!!!!!!!!!!!")
		console.log("==========================================================")
		sampleFile = `SECRET="${Math.random().toString(36).substr(2, 24)}"
									TOKEN_EXPIRE="2"
									CONSUMER_KEY="${Math.random().toString(36).substr(2, 24)}"
									SHARED_SECRET="${Math.random().toString(36).substr(2, 24)}"
									DATABASE="mongodb://127.0.0.1:27017/buddy"`;
		fs.writeFileSync(envPath + "_sample", sampleFile);
    console.log("==========================================================")
    console.log("!!!!!!!!!!!!!!!!!!! Sample file saved !!!!!!!!!!!!!!!!!!!!")
    console.log("Please customize this file, rename it to .env and restart!")
    console.log("==========================================================")
    process.exit(9);
	}
}
