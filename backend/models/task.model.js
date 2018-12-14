var db = require('../dbconnection');

class Task {
    static getAllTasks(callback) {
        return db.query("select * from task", callback);
    }
    static getTaskById(id, callback) {
        return db.query("select * from task where id=?", [id], callback);
    }
    static addTask(Task, callback) {
        return db.query("insert into task values(?,?,?)", [Task.id, Task.title, Task.status], callback);
    }
    static deleteTask(id, callback) {
        return db.query("delete from task where id=?", [id], callback);
    }
    static updateTask(id, Task, callback) {
        return db.query("update task set title=?, status=?, where id=?", [Task.title, Task.status, id], callback);
    }
}

module.export = Task;