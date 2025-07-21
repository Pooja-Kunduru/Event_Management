const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    date: { type: String, required: true },   // Store as string for simplicity
    time: { type: String, required: true },   // Store as string for simplicity
    location: { type: String, required: true },
    completed: { type: Boolean, required: true },
    decoration: { type: Boolean, required: true, default: false },
    catering: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Task', taskSchema);
