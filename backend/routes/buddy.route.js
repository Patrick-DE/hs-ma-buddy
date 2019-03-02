var express = require('express');
var router = express.Router();

var buddy_controller = require('../controllers/buddy.controller');
var VerifyToken = require('../verifyToken');

//Get all buddies
router.get('/', VerifyToken, buddy_controller.buddy_list);

//Get buddy details
router.get('/:id', VerifyToken, buddy_controller.buddy_detail);

/* ONLY BUDDY*/
//Delete a buddy
router.delete('/:id', VerifyToken, buddy_controller.buddy_delete);

module.exports = router;
