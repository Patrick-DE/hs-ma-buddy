var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var buddySchema = new Schema({
    moodle_id: { type: Number, required: true, unique: true},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    mobile: String,
    email2: String,
    available: { type: Boolean, required: true, default: false},
    room: String,
    blocked: { type: Boolean, required: true, default: false},
    away: { type: Boolean, required: true, default: false},
    away_reason: String
});

buddySchema
    .virtual('email')
    .get(function(){
        return this.first_name + '.' + this.last_name + '@stud.hs-mannheim.de';
    })

buddySchema
    .virtual('fullname')
    .get(function(){
        return this.first_name + " " + this.last_name;
    })

var Buddy = mongoose.model('buddies', buddySchema);
module.exports = Buddy

//TODO: Block_id als referenz hinzufügen