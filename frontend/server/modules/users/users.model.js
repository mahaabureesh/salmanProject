const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    buisness: String,
    password: String,
    identify: String
});

module.exports = mongoose.model('users', UserSchema);