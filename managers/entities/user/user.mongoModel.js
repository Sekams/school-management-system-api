const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: false },
        email: { type: String, required: false, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'student' },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
