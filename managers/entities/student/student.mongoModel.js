const { uniq } = require('lodash');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
        courses: [{ type: String }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Student', studentSchema);
