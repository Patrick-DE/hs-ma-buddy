//var db = require('../dbconnection');
//const Task = require('../models/task.model');


// Retrieve tasks by id from database.
exports.getTaskById = (req, res) => {
    var id = req.params.id;
    db.query("select * from task where id=?", [id], function (err, rows){
        if (err) return res.json(err);
        res.json(rows);
    });
};

// Retrieve and return all tasks from the database.
exports.getAllTasks = (req, res) => {
    db.query("select * from task", function (err, rows){
        if (err) return res.json(err);
        res.json(rows);
    });
};

//Create a task
exports.addTask = (req, res) => {
    var id = req.body.id, title = req.body.title, status = req.body.status;
    db.query("insert into task values(?,?,?)", [id, title, status], function(err, rows){
        if (err) return res.json(err);
        res.json(req.body); //or return count for 1 if successfull
    });
};

// DELETE task
exports.deleteTask = (req, res) => {
    var id = req.params.id;
    db.query("delete from task where id=?", [id], function(err, rows){
        if (err) return res.json(err);
        res.json(count);
    });
};

// Update task
exports.updateTask = (req, res) => {
    var id = req.body.id, title = req.body.title, status = req.body.status;
    db.query("update task set title=?, status=?, where id=?", [title, status, id], function(err, rows){
        if (err) return res.json(err);
        res.json(rows);
    });
};