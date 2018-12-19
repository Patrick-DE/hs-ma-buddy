var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var buddySchema = new Schema({
    moodle_id: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    surename: { type: String, required: true},
    mobile: String,
    email: String,
    available: { type: Boolean, required: true, default: false},
    room: String,
    blocked: { type: Boolean, required: true, default: false},
    away: { type: Boolean, required: true, default: false},
    away_reason: String
});
var Buddy = mongoose.model('buddies', buddySchema);
module.exports = Buddy

//TODO: Block_id als referenz hinzufügen