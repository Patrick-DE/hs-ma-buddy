var Appointment = require('../models/appointment.model');
const moment = require('moment')

// Display list of all appointments.
exports.appointment_list = function(req, res, next) {
    if(req.query.start === undefined || req.query.end === undefined) return res.status(400).send("Please provide a start and end parameter.");

    Appointment
      .find({
        $and: [{
          $or: [
            {user_id: req.userId},
            {buddy_id: req.userId}
          ],
          $and: [
            {start : {$gte: req.query.start}},
            {end: {$lte: req.query.end}}
          ]
        }]
      })
      .populate('block_id')
      .populate('category_id')
      .exec(function (err, appointments) {
        if (err) return res.send(err.errmsg);
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
  if(!req.body.date || !req.body.category_id) return res.status(400).send({err: "Please provide all required data."});
  var _start = moment(req.body.date + " " + req.body.start, 'DD-MM-YYYY hh:mm');
  var _end = moment(req.body.date + " " + req.body.end, 'DD-MM-YYYY hh:mm');

  var newAppointment = new Appointment({
    ...req.body,
    start: _start,
    end: _end,
    //override user_id so it cannot be tampered if send with the request
    user_id: req.userId
  });

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
