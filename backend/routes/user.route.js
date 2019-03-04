var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user.controller');
var Verify = require('../verifyToken');

//Get all user
router.get('/', user_controller.user_list);

//Get user details
router.get('/:id', user_controller.user_detail);

//Create a new user
//router.post('/', user_controller.user_create);

//Update a user
router.delete('/:id', user_controller.user_delete);

//Delete a user
router.put('/:id', user_controller.user_update);

module.exports = router;