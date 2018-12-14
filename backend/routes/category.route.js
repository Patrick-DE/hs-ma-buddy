var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/category.controller');

//Get all category
router.get('/', category_controller.category_list);

//Get category details
router.get('/:id', category_controller.category_detail);

//Create a new category
router.post('/', category_controller.category_create);

//Update a category
router.put('/:id', category_controller.category_delete);

//Delete a category
router.delete('/:id', category_controller.category_update);

module.exports = router;
