var Appointment = require('../models/appointment.model');
var mongoose = require('mongoose');
const moment = require('moment');

// Display list of all appointments.
exports.own_appointment_list = function(req, res, next) {
    if(req.query.start === undefined || req.query.end === undefined) return res.status(400).send({ err: "Please provide a start and end parameter."});
    var _start = moment(req.query.start, 'YYYY-MM-DD');
    var _end = moment(req.query.end, 'YYYY-MM-DD');
    if(!_start._isValid || !_end._isValid) return res.status(400).send({ err: "Please provide a correct date format."});

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
      .populate('buddy_id')
      .exec(function (err, _appointments) {
        if (err){
          console.log(err, req);
          return res.send(err.errmsg);
        } 
        res.status(200).json(_appointments);
    });
};

// Display list of all appointments ANONymisiert.
exports.anon_appointment_list = function(req, res, next) {
  if(req.query.start === undefined || req.query.end === undefined) return res.status(400).send({err: "Please provide a start and end parameter."});
  var _start = moment(req.query.start, 'YYYY-MM-DD');
  var _end = moment(req.query.end, 'YYYY-MM-DD');
  if(!_start._isValid || !_end._isValid) return res.status(400).send({ err: "Please provide a correct date format."});

  Appointment
    .find({
      $and: [
        {start : {$gte: req.query.start}},
        {end: {$lte: req.query.end}}
      ]
    })
    .select('-email -user_id -fullname')
    .populate('block_id')
    .populate('category_id')
    .populate('buddy_id')
    .exec(function (err, appointments) {
      if (err) return res.status(500).send({err: err.errmsg});
      res.status(200).json(make_anon(appointments, req));
  });
};

// Display list of all appointments of ONE buddy.
exports.buddy_appointment_list = function(req, res, next) {
  if(req.query.start === undefined || req.query.end === undefined) return res.status(400).send({ err: "Please provide a start and end parameter."});
  var _start = moment(req.query.start, 'YYYY-MM-DD');
  var _end = moment(req.query.end, 'YYYY-MM-DD');
  if(!_start._isValid || !_end._isValid) return res.status(400).send({ err: "Please provide a correct date format."});

  Appointment
    .find({
      $and: [
        {buddy_id: req.params.id},
        {$and: [
          {start : {$gte: req.query.start}},
          {end: {$lte: req.query.end}}
        ]}
      ]
    })
    .select('-email -fullname')
    .populate('block_id')
    .populate('category_id')
    .populate('buddy_id')
    .exec(function (err, appointments) {
      if (err) return res.status(500).send({err: err.errmsg});
      res.status(200).json(make_anon(appointments, req));
  });
};

// Display detail page for a specific appointment.
exports.appointment_detail = function(req, res, next) {
    var id = req.params.id;
    if(req.params.id === undefined) return res.status(400).send({err: "Please provide a valid id."});

    Appointment
      .findOne({
        $and: [
          {_id: id},
          {$or: [ {user_id: req.userId}, {buddy_id: req.userId}]}
        ],
      })
      .populate('block_id')
      .exec(function (err, appointment) {
        if (err) return res.status(500).send({err: err.message});
        if (!appointment) return res.status(404).send("not found")

        res.status(200).json(appointment);
    });
};

// Handle appointment create on POST.
exports.appointment_create = function(req, res, next) {
  if(!req.body.date || !req.body.category_id || !req.body.start || !req.body.end || !req.body.description || !req.body.title) return res.status(400).send({err: "Please provide all required data."});
  var _start = moment(req.body.date + " " + req.body.start, 'DD-MM-YYYY HH:mm');
  var _end = moment(req.body.date + " " + req.body.end, 'DD-MM-YYYY HH:mm');

  var newAppointment = new Appointment({
    ...req.body,
    start: _start,
    end: _end,
    //override user_id so it cannot be tampered if send with the request
    user_id: req.userId
  });

  newAppointment.save(function(err) {
    if (err) return res.status(500).send(err.message);
    res.status(201).send(newAppointment);
  });
};

// Handle appointment delete on DELETE.
exports.appointment_delete = function(req, res, next) {
    var id = req.params.id;
    if(req.params.id === undefined) return res.status(400).send({err: "Please provide a valid id."});

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
        res.status(200).send(appointment);
    });
};

/*
*TODO: check for params which should not be editable
*/
// Handle appointment update on PUT.
exports.appointment_update = function(req, res, next) {
    var id = req.params.id;
    if(req.params.id === undefined) return res.status(400).send({err: "Please provide a valid id."});
    req.body.start = moment(req.body.date + " " + req.body.start, 'DD-MM-YYYY hh:mm');
    req.body.end = moment(req.body.date + " " + req.body.end, 'DD-MM-YYYY hh:mm');

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
      .populate('category_id')
      .populate('buddy_id')
      .exec(function(err, appointment){ //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.status(500).send(err.message);
        res.status(200).json(appointment);
    });
};

function make_anon(appointment, req) {
  appointment.forEach(element => {
    if(element.buddy_id.id !== req.buddyId && !element.user_id.equals(mongoose.Types.ObjectId(req.userId))){
      element.title = "Termin";
      element.description = "Beschreibung";
      element.editable = false;
      //TODO: Try to delete user_id
    }else{ var yoloswag = "";}
  });

  return appointment;
}