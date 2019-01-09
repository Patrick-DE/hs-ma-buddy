var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/category.controller');
var VerifyToken = require('../verifyToken');

//Get all category
router.get('/', VerifyToken, category_controller.category_list);

//Get category details
router.get('/:id', VerifyToken, category_controller.category_detail);

//Create a new category
router.post('/', VerifyToken, category_controller.category_create);

//Update a category
router.delete('/:id', VerifyToken, category_controller.category_delete);

//Delete a category
router.put('/:id', VerifyToken, category_controller.category_update);

module.exports = router;
