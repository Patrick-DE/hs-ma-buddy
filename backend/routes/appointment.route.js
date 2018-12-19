var express = require('express');
var router = express.Router();

var appointment_controller = require('../controllers/appointment.controller');

//Get all appointment
router.get('/', appointment_controller.appointment_list);

//Get appointment details
router.get('/:id', appointment_controller.appointment_detail);

//Create a new appointment
router.post('/', appointment_controller.appointment_create);

//Update a appointment
router.delete('/:id', appointment_controller.appointment_delete);

//Delete a appointment
router.put('/:id', appointment_controller.appointment_update);

module.exports = router;
