const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema(
    {
        userId: String,
        userKey: String,
        deviceId: { type: String, required: false },
        sessionId: { type: String, required: false },
        expiresAt: Date,
        type: String,
        deleted: Boolean,
    },
    { timestamps: true },
);

module.exports = mongoose.model('Token', tokenSchema);
