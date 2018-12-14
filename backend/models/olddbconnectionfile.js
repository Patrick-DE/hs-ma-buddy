var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var buddySchema = new Schema({
    moodle_id: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    surename: { type: String, required: true},
    mobile: String,
    email: String,
    available: Boolean,
    room: String,
    blocked: { type: Boolean, required: true},
    away: Boolean,
    away_reason: String
});
var Buddy = mongoose.model('buddies', buddySchema);
module.exports = Buddy

var categorySchema = new Schema({
    name: { type: String, required: true },
    category_id: { type: Number, required: true, unique: true },
});
var Category = mongoose.model('categories', categorySchema);
module.exports = Category;
/*
con.query("SELECT COUNT(*) AS count FROM `information_schema`.`tables` WHERE `table_schema` = DATABASE() AND `table_name` = 'buddy_category'", function (err, result) {
    if (err) throw err;
    if(result[0].count === 0){
        var sql = "CREATE TABLE buddy_category (buddy_id INT PRIMARY KEY, category_id INT PRIMARY KEY)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table 'buddy_category' created");
        });
    }
});*/

var blockSchema = new Schema({
    block_id: { type: Number, required: true, unique: true},
    start_time: { type: Number, required: true},//Minutes SINCE 00:00
    end_time: { type: Number, required: true},
});
var Block = mongoose.model('blocks', blockSchema);
module.exports = Block;

/*
con.query("SELECT COUNT(*) AS count FROM `information_schema`.`tables` WHERE `table_schema` = DATABASE() AND `table_name` = 'buddy_block'", function (err, result) {
    if (err) throw err;
    if(result[0].count === 0){
        var sql = "CREATE TABLE buddy_block (block_id INT PRIMARY KEY, buddy_id INT PRIMARY KEY)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table 'buddy_block' created");
        });
    }
});*/

var appointmentSchema = new Schema({
    block_id: {type: Schema.Types.ObjectId, ref: 'Block'},
    buddy_id: {type: Schema.Types.ObjectId, ref: 'Buddy'},
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'},
    moodle_id: { type: Number, required: true},
    room: { type: String, required: true},
    fullname: { type: String, required: true},
    status: Boolean,
    urgency: { type: Boolean, default: 0 },
    description: { type: String, required: true},
    start_time: Number,
    end_time: Number
});
var Appointment = mongoose.model('appointments', appointmentSchema);
module.exports = Appointment;


module.exports = mongoose;


//TEST ADDING Category
var testCategory = new Category({
    name: "testCategory",
    category_id: 0
});
testCategory.save(function(err) {
    if (err) throw err;
    console.log('TestCategory saved successfully!');
});
//TEST ADDING Category
var testBuddy = new Buddy({
    moodle_id: 1611812,
    name: "Eisenschmidt",
    surename: "Patrick",
    mobile: "017624440132",
    email: "1611812@stud.hs-mannheim.de",
    available: false,
    room: "",
    blocked: false,
    away: true,
    away_reason: "Essen!!!"
});
testBuddy.save(function(err) {
    if (err) throw err;
    console.log('testBuddy saved successfully!');
});

//TEST ADDING all blocks
db.collection('blocks').insertMany([
    //Minutes SINCE 00:00
    { start_time: 480, //08:00
        end_time: 570, //09:30
        block_id: 0 //
    },
    { start_time: 585, //09:45
        end_time: 675, //11:15
        block_id: 1 //
    },
    { start_time: 720, //12:00
        end_time: 810, //13:30
        block_id: 2 //
    },
    { start_time: 820, //13:40
        end_time: 910, //15:10
        block_id: 3 //
    },
    { start_time: 920, //15:20
        end_time: 1010, //16:50
        block_id: 4 //
    }
])
.then(function(result) {
// process result
})

//TEST ADDING appointment
var testAppointment = new Appointment({
    block_id: {type: Schema.Types.ObjectId, ref: 'blocks'},
    buddy_id: {type: Schema.Types.ObjectId, ref: 'buddies'},
    category_id: {type: Schema.Types.ObjectId, ref: 'categories'},
    moodle_id: { type: Number, required: true},
    room: { type: String, required: true},
    fullname: { type: String, required: true},
    status: Boolean,
    urgency: { type: Boolean, default: 0 },
    description: { type: String, required: true},
    start_time: Number,
    end_time: Number
});
testCategory.save(function(err) {
    if (err) throw err;
    console.log('TestCategory saved successfully!');
});
