const express = require('express');
const bodyParser = require('body-parser');

// create the app
const app = express();

//require('./models/dummyData.model');

// Require routes
//require('./routes/task.route')(app);
var buddy = require('./routes/buddy.route');
var category = require('./routes/category.route');
var block = require('./routes/block.route');
var appointment = require('./routes/appointment.route');
app.use('/buddy', buddy);
app.use('/category', category);
app.use('/block', block);
app.use('/appointment', appointment);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
