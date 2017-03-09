let mongoose = require('mongoose');
let Task = require('../models/task'); // mongoose model
// we require express so we can use his router
var express = require('express');
var router = express.Router();

/*
 * GET /task route to retrieve all the tasks.
 */
router.get('/tasks', function (req, res) {
    //Query the DB and if no errors, send all the tasks
    let query = Task.find({});
    query.exec((err, tasks) => {
        if (err) res.send(err);
        //If no errors, send them back to the client
        res.json({ data: tasks });
    });
});
/*
 * POST /tasks to save a new task.
 */
router.post('/tasks', function (req, res) {
    //Creates a new task via mongoose model and request body sent
    var newTask = new Task(req.body);
    //Save it into the DB.
    newTask.save((err, task) => {
        if (err) {
            res.send(err);
        }
        else { //If no errors, send new task back to the client
            res.json({ message: "Task successfully added!", task });
        }
    });
});
/*
 * GET /tasks/:id route to retrieve a task given its id.
 */
router.get('/tasks/:id', function (req, res) {
    Task.findById(req.params.id, (err, task) => {
        if (!task) { return res.status(404).send({ error: "404 no results sorry" }); }
        if (err) res.send(err);
        //If no errors, send it back to the client
        res.json(task);
    });
});
/*
 * DELETE /task/:id to delete a tasks given its id.
 */
router.delete('/tasks/:id', function (req, res) {
    Task.remove({ _id: req.params.id }, (err, result) => {
        res.json({ message: "Task successfully deleted!", result });
    });
});

/*
 * PUT /tasks/:id to updatea a tasks given its id
 */
router.put('/tasks/:id', function (req, res) {
    Task.findById({ _id: req.params.id }, (err, task) => {
        if (err) res.send(err);
        // use Object.assign to recreate with new data.. ES6
        Object.assign(task, req.body).save((err, task) => {
            if (err) res.send(err);
            res.json({ message: 'Task updated!', task });
        });
    });
});


//export the router so we can use him inside server.js
module.exports = router;