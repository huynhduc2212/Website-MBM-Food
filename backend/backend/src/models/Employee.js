const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'staff', enum: ['staff', 'manager', 'admin'] }
});

module.exports = mongoose.model('Employee', employeeSchema);