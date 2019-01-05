var mongoose = require('mongoose');
//mongodb://your_user_namer:your_password@ds119748.mlab.com:19748/local_library
var mongodb = 'mongodb://192.168.178.23:27017/buddy';
mongoose.connect(mongodb, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

//test
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected!");
  
});

module.exports = mongoose;