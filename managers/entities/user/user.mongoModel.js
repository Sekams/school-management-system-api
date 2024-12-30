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

userSchema.index({ username: -1, email: -1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
