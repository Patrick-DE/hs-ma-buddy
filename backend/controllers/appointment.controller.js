var Appointment = require('../models/appointment.model');

// Display list of all appointments.
exports.appointment_list = function(req, res, next) {
    Appointment
      .find({user_id: req.userId})
      .populate('block_id')
      .exec(function (err, appointments) {
        if (err) return res.send(err.errmsg);
        res.json(appointments);
    });
};

// Display detail page for a specific appointment.
exports.appointment_detail = function(req, res, next) {
    var id = req.params.id;
    Appointment
      .findById(id)
      .populate('block_id')
      .exec(function (err, appointment) {
        if (err) return res.send(err.errmsg);
        //does this appointment belong to the user
        if( req.userId !== appointment.buddy_id && req.userId !== appointment.user_id) return res.status(403).send({err: "You are not allowed to view this appointment!"});
        res.json(appointment);
    });
};

// Handle appointment create on POST.
exports.appointment_create = function(req, res, next) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    var newAppointment = new Appointment({
      ...req.body,
      date: today,
    })
    //override user_id so it cannot be tampered if send with the request
    newAppointment.user_id = req.userId;

    newAppointment.save(function(err) {
        if (err) return res.send(err.errmsg);
        res.status(201).send(newAppointment);
    });
};

// Handle appointment delete on DELETE.
exports.appointment_delete = function(req, res, next) {
    var id = req.params.id;
    if( req.userId !== appointment.buddy_id && req.userId !== appointment.user_id) return res.status(403).send({err: "You are not allowed to delete this appointment!"});
    Appointment
      .findOneAndDelete({
          $and: [
            {id: id},
            {$or: [ {user_id: req.userId}, {user_id: req.userId}]}
          ]
        })
      .populate('block_id')
      .exec(function(err, appointment){
        if (err) return res.send(err.errmsg);
        //does this appointment belong to the user
        res.send(appointment);
    });
};

// Handle appointment update on PUT.
exports.appointment_update = function(req, res, next) {
    var id = req.params.id;
    Appointment
      .findOneAndUpdate({
        $and: [
            {id: id},
            {$or: [ {user_id: req.userId}, {user_id: req.userId}]}
          ]},
        req.body,
        {new: true}
      )
      .populate('block_id')
      .exec(function(err, appointment){ //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.send(err.errmsg);
        res.json(appointment);
    });
};
