const mongoose = require('mongoose');
const { Schema } = mongoose;

const schoolSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        desc: { type: String, required: false },
        administrators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('School', schoolSchema);
