var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: { type: String, required: true },
    category_id: { type: Number, required: true, unique: true },
});
var Category = mongoose.model('categories', categorySchema);
module.exports = Category;