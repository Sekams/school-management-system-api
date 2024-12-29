const mongoose = require('mongoose');
const { Schema } = mongoose;

const classroomSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        capacity: { type: Number, required: true },
        school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
        courses: [{ type: String }],
        students: [{ type: Schema.Types.ObjectId, ref: 'Student', required: true }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Classroom', classroomSchema);
