var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/auth.controller');
var VerifyToken = require('../verifyToken');

//Get logged in user
router.get('/me', VerifyToken, auth_controller.user_detail);

//Invalidate token
router.get('/logout', auth_controller.user_logout);

//If user exists, set valid token else create user (MOODLE)
//Set valid token if successfull (CHALLENGE)
router.post('/login', auth_controller.user_login);

module.exports = router;