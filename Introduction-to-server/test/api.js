//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Task = require('../app/models/task');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server'); // our main server file
let should = chai.should();

chai.use(chaiHttp); // used to make http calls

//Our parent block
describe('Tasks', () => {
    beforeEach((done) => { //Before each test we empty the database
        Task.remove({}, (err) => { 
           done();         
        });     
    });

    // TEST GET ROUTE
  describe('/GET task', () => {
      it('it should GET all the tasks', (done) => {
        chai.request(server)
            .get('/api/tasks')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(0);
              done();
            });
      });
  });  // end GET

  // POST - create task test - missing 1 required field
  describe('/POST tasks', () => {
      it('it should not POST a task without name field', (done) => {
        let task = {
            completed: true
        }
        chai.request(server)
            .post('/api/tasks')
            .send(task)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('name');
                res.body.errors.name.should.have.property('kind').eql('required');
              done();
            });
      }); 
      it('it should POST a task ', (done) => {
        let task = {
            name : 'This is a task',
            completed: false
        }
        chai.request(server)
            .post('/api/tasks')
            .send(task)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Task successfully added!');
                res.body.task.should.have.property('name');
                res.body.task.should.have.property('completed');
              done();
            });
      });
  });
   // end describe /POST task...

   describe('/GET/:id task', () => { // GET TASK by ID
        it('it should GET a task by the given id', (done) => {
        let task = new Task( { name : 'This is a task', completed: false });
            task.save((err, task) => {
                chai.request(server)
                .get('/api/tasks/' + task.id)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('completed');
                    res.body.should.have.property('_id').eql(task.id);
                done();
                });
            });

        });
    }); // end describe /GET:id tasks...

    describe('/PUT/:id task', () => {
        it('it should UPDATE a task given the id', (done) => {
        let task = new Task( { name : 'This is a task', completed: false });
            task.save((err, task) => {
                    chai.request(server)
                    .put('/api/tasks/' + task.id)
                    .send({ name : 'This is a task', completed: true })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Task updated!');
                        res.body.task.should.have.property('completed').eql(true); // this must be updated
                    done();
                    });
            });
        });
    });  // end describe /PUT/:id task'

    describe('/DELETE/:id task', () => {
        it('it should DELETE a task given the id', (done) => {
        let task = new Task( { name : 'This is a task', completed: false  });
            task.save((err, task) => {
                    chai.request(server)
                    .delete('/api/tasks/' + task.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Task successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                    done();
                    });
            });
        });
    });     // end describe /DELETE/:id task

   
}); // end of parent 'Tasks' block