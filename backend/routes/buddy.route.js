var express = require('express');
var router = express.Router();

var buddy_controller = require('../controllers/buddy.controller');

//Get all buddies
router.get('/', buddy_controller.buddy_list);

//Get buddy details
router.get('/:id', buddy_controller.buddy_detail);

//Create a new buddy
// router.post('/', buddy_controller.buddy_create);

//Update a buddy
//router.delete('/:id', buddy_controller.buddy_delete);

//Delete a buddy
//router.put('/:id', buddy_controller.buddy_update);

module.exports = router;
