var mongoose = require('../dbconnection');
var Block = require('./block.model')
const moment = require('moment')

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    block_id: {type: Schema.Types.ObjectId, ref: 'blocks', required: true},
    buddy_id: {type: Schema.Types.ObjectId, ref: 'buddies', required: true},
    category_id: {type: Schema.Types.ObjectId, ref: 'categories', required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    room: { type: String, required: true},
    status: Boolean, //annehmen/ablehnen
    urgency: { type: Boolean, default: false },
    description: { type: String, required: true},
    date: { type: Date, required: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

appointmentSchema
    .virtual('start_date')
    .get(function(){
      const start_date = moment(this.date);
      if(typeof this.block_id === "object") {
        start_date.minute(this.block_id.start_minute);
        start_date.hour(this.block_id.start_hour);
      }
      return start_date.toDate()
    })

appointmentSchema
    .virtual('end_date')
    .get(function(){
      const end_date = moment(this.date);
      if(typeof this.block_id === "object") {
        end_date.minute(this.block_id.end_minute);
        end_date.hour(this.block_id.end_hour);
      }
      return end_date.toDate()
    })

appointmentSchema
    .virtual('fullname')
    .get(function(){
        return this.first_name + " " + this.last_name;
    })

appointmentSchema
    .virtual('email')
    .get(function(){
        return this.first_name + '.' + this.last_name + '@stud.hs-mannheim.de';
    })


var Appointment = mongoose.model('appointments', appointmentSchema);
module.exports = Appointment;
