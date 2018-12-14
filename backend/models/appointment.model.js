var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    block_id: {type: Schema.Types.ObjectId, ref: 'Block', required: true},
    buddy_id: {type: Schema.Types.ObjectId, ref: 'Buddy', required: true},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    moodle_id: { type: Number, required: true},
    room: { type: String, required: true},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},    
    status: Boolean, //annehmen/ablehnen
    urgency: { type: Boolean, default: false },
    description: { type: String, required: true},
    start_time: Number,
    end_time: Number
});

appointmentSchema
    .virtual('duration_h')
    .get(function(){
        return (this.end_time - this.start_time)/60;
    })

appointmentSchema
    .virtual('duration_m')
    .get(function(){
        return (this.end_time - this.start_time);
    })

appointmentSchema
    .virtual('start')
    .get(function(){
        return this.start_time/60;
    })

appointmentSchema
    .virtual('end')
    .get(function(){
        return this.end_time/60;
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