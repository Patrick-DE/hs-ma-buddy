var express = require('express');
var router = express.Router();
const verifyToken = require('../verifyToken')

var appointment_controller = require('../controllers/appointment.controller');
var VerifyToken = require('../verifyToken');

//Get all appointment
router.get('/own', verifyToken, appointment_controller.own_appointment_list);

//Get all appointment
router.get('/all', verifyToken, appointment_controller.anon_appointment_list);

//Get all appointment
router.get('/buddy/:id', verifyToken, appointment_controller.buddy_appointment_list);

//Get appointment details
router.get('/:id', VerifyToken, appointment_controller.appointment_detail);

//Create a new appointment
router.post('/', VerifyToken, appointment_controller.appointment_create);

//Update a appointment
router.put('/:id', VerifyToken, appointment_controller.appointment_update);

//Delete a appointment
router.delete('/:id', VerifyToken, appointment_controller.appointment_delete);

module.exports = router;
