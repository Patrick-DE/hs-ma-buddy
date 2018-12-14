var Appointment = require('../models/appointment.model');

// Display list of all appointments.
exports.appointment_list = function(req, res) {
    Appointment.find(function (err, appointments) {
        if (err) return console.error(err);
        res.json(appointments);
    })
};

// Display detail page for a specific appointment.
exports.appointment_detail = function(req, res) {
    var id = req.params.id;
    Appointment.findById(id, function (err, appointment) {
        if (err) return console.error(err);
        res.json(appointment);
    })
};

// Handle appointment create on POST.
exports.appointment_create = function(req, res) {
    var newAppointment = new Appointment(req.body)
    newAppointment.save(function(err) {
        if (err) return console.error(err);
        req.send("Appointment was added!");
    });
};

// Handle appointment delete on POST.
exports.appointment_delete = function(req, res) {
    Appointment.findByIdAndDelete(id, function(err, appointment){
        if (err) return console.error(err);
        res.send("Appointment was deleted!");
    })
};

// Handle appointment update on POST.
exports.appointment_update = function(req, res) {
    Appointment.findByIdAndUpdate(id, req.body, function(err, appointment){
        if (err) return console.error(err);
        res.send("Appointment was updated!");
    })
};