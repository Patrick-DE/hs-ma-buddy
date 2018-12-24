var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/auth.controller');
var VerifyToken = require('../verifyToken');

//Get logged in user
router.get('/me', VerifyToken, auth_controller.user_detail);

//Register user, used by MOODLE
router.post('/register', auth_controller.user_register);

//Invalidate token
router.get('/logout', auth_controller.user_logout);

//Set valid token
router.post('/login', auth_controller.user_login);

module.exports = router;