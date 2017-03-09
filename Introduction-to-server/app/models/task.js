// dependencies
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//TaskSchema
/* versionKey - When enabled, the version value is atomically incremented whenever a document is updated. */
let TaskSchema = new Schema(
  {
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },      
  }, 
  { 
    versionKey: false 
  }
);

// Sets the createdAt parameter equal to the current time
TaskSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the TaskSchema for use elsewhere.
module.exports = mongoose.model('task', TaskSchema);