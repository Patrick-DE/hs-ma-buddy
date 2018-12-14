module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js');
    
    //Display all task
    app.get('/', tasks.getAllTasks);

    //Display task by id
    app.get('/:id', tasks.getTaskById);

    //Create a new task
    app.post('/task', tasks.addTask);

    //Update a new task
    app.put('/task/:id', tasks.updateTask);
    
    //Delete a new task
    app.delete('/task/:id', tasks.deleteTask);
}