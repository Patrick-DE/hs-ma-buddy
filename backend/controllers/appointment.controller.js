var Appointment = require('../models/appointment.model');

// Display list of all appointments.
exports.appointment_list = function(req, res, next) {
    Appointment
      .find({$or: [ {user_id: req.userId}, {buddy_id: req.userId}]})
      .populate('block_id')
      .exec(function (err, appointments) {
        if (err) return res.status(500).send(err.errmsg);
        res.json(appointments);
    });
};

// Display detail page for a specific appointment.
exports.appointment_detail = function(req, res, next) {
    var id = req.params.id;
    Appointment
      .findOne({
        $and: [
          {_id: id},
          {$or: [ {user_id: req.userId}, {buddy_id: req.userId}]}
        ],
      })
      .populate('block_id')
      .exec(function (err, appointment) {
        if (err) return res.status(500).send(err.message);
        if (!appointment) return res.status(404).send("not found")

        res.json(appointment);
    });
};

// Handle appointment create on POST.
exports.appointment_create = function(req, res, next) {
    if(!req.body.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      req.body.date = today
    }

    var newAppointment = new Appointment({
      ...req.body,
    })
    //override user_id so it cannot be tampered if send with the request
    newAppointment.user_id = req.userId;

    newAppointment.save(function(err) {
        if (err) {
          console.log(err)
          return res.status(500).send(err.message);
        }
        res.status(201).send(newAppointment);
    });
};

// Handle appointment delete on DELETE.
exports.appointment_delete = function(req, res, next) {
    var id = req.params.id;
    
    Appointment
      .findOneAndDelete({
          $and: [
            {_id: id},
            {$or: [ {user_id: req.userId}, {buddy_id: req.userId}]}
          ]
        })
      .populate('block_id')
      .exec(function(err, appointment){
        if (err) return res.status(500).send(err.message);
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
            {_id: id},
            {$or: [ {user_id: req.userId}, {buddy_id: req.userId}]}
          ]},
        req.body,
        {new: true}
      )
      .populate('block_id')
      .exec(function(err, appointment){ //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.status(500).send(err.message);
        res.json(appointment);
    });
};
