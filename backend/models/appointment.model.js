var mongoose = require('../dbconnection');
var Block = require('./block.model')
const moment = require('moment')

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    block_id: {type: Schema.Types.ObjectId, ref: 'blocks' },
    buddy_id: {type: Schema.Types.ObjectId, ref: 'buddies', required: true },
    category_id: {type: Schema.Types.ObjectId, ref: 'categories', required: true },
    user_id: {type: Schema.Types.ObjectId, ref: 'users', required: true },
    room: { type: String },
    status: Boolean, //annehmen/ablehnen
    urgency: { type: Boolean, default: false },
    description: { type: String, required: true },
    //date: { type: Date, required: true },
    //DATA FROM FULL CALENDAR
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    editable: { type: Boolean, default: true },
    overlap: { type: Boolean, default: false },
    color: { type: String },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

/*
appointmentSchema
    .virtual('start_date')
    .get(function(){
      const start_date = moment(this.date);
      if(typeof this.block_id === "object" && this.block_id !== null) {
        start_date.minute(this.block_id.start_minute);
        start_date.hour(this.block_id.start_hour);
      }
      return start_date.toDate()
    })

appointmentSchema
    .virtual('end_date')
    .get(function(){
      const end_date = moment(this.date);
      if(typeof this.block_id === "object" && this.block_id !== null) {
        end_date.minute(this.block_id.end_minute);
        end_date.hour(this.block_id.end_hour);
      }
      return end_date.toDate()
    })
*/
appointmentSchema
    .virtual('fullname')
    .get(function(){
      if(typeof this.user_id === "object" && this.user_id !== null) {
        return this.user_id.first_name + " " + this.user_id.last_name;
      }
      return undefined;
    })

appointmentSchema
    .virtual('email')
    .get(function(){
      if(typeof this.user_id === "object" && this.user_id !== null) {
        return this.user_id.first_name + '.' + this.user_id.last_name + '@stud.hs-mannheim.de';
      }
      return undefined;
    })


var Appointment = mongoose.model('appointments', appointmentSchema);
module.exports = Appointment;
