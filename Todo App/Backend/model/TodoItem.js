const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
  task : {type: String, required: true},
  date : {type: Date, required: true},
  time : {type: String},
  completed : {type: Boolean, default: false },
  createdAt: {type: Date, default: Date.now} 
});

module.exports = mongoose.model("TodoItem", todoItemSchema);