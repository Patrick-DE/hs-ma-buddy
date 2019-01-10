var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/chal_auth.controller');
var verifyToken = require('../verifyToken');

//Get logged in user
router.get('/me', verifyToken, auth_controller.user_detail);

//Register user only CHALLENGE
router.post('/register', auth_controller.user_register);

//Invalidate token
router.get('/logout', auth_controller.user_logout);

//If user exists, set valid token else create user (MOODLE)
//Set valid token if successfull (CHALLENGE)
router.post('/login', auth_controller.user_login);

//Added route for search
router.post('/search', verifyToken, auth_controller.search);

module.exports = router;
