var express = require('express');
var router = express.Router();

var block_controller = require('../controllers/block.controller');

//Get all block
router.get('/', block_controller.block_list);

//Get block details
router.get('/:id', block_controller.block_detail);

//Create a new block
//router.post('/', block_controller.block_create);

//Update a block
//router.delete('/:id', block_controller.block_delete);

//Delete a block
//router.put('/:id', block_controller.block_update);

module.exports = router;
