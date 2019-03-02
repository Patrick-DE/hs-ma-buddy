var express = require('express');
var router = express.Router();

var block_controller = require('../controllers/block.controller');
var VerifyToken = require('../verifyToken');

//Get all block
router.get('/', VerifyToken, block_controller.block_list);

//Get block details
router.get('/:id', VerifyToken, block_controller.block_detail);

//Create a new block
//router.post('/', VerifyToken, block_controller.block_create);

//Update a block
//router.delete('/:id', VerifyToken, block_controller.block_delete);

//Delete a block
//router.put('/:id', VerifyToken, block_controller.block_update);

module.exports = router;
