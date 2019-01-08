var express = require('express');
var router = express.Router();
const verifyToken = require('../verifyToken')

var appointment_controller = require('../controllers/appointment.controller');

//Get all appointment
router.get('/', verifyToken, appointment_controller.appointment_list);

//Get appointment details
router.get('/:id', verifyToken, appointment_controller.appointment_detail);

//Create a new appointment
router.post('/', verifyToken, appointment_controller.appointment_create);

//Update a appointment
router.delete('/:id', verifyToken, appointment_controller.appointment_delete);

//Delete a appointment
router.put('/:id', verifyToken, appointment_controller.appointment_update);

module.exports = router;
