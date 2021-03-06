var mongoose = require('../dbconnection'); 

var Schema = mongoose.Schema;

//Save USERDATA from Moodle for looking up and changing own appointments
var userSchema = new Schema({  
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},      
    moodle_id: { type: Number, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    buddy: { type: Schema.Types.ObjectId, ref: 'buddies' },
});

userSchema
    .virtual('fullname')
    .get(function(){
        return this.first_name + " " + this.last_name;
    })

var User = mongoose.model('User', userSchema);

module.exports = User;