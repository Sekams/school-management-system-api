const _ = require('lodash');

module.exports = class Student {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;
        this.studentCollection = 'Student';
        this.userExposed = ['patch=updateStudentProfile'];
        this.adminExposed = ['post=enrollStudent', 'patch=transferStudent', 'patch=updateStudentProfile'];
    }

    _getCoursesEnrolled(selectedCourses = [], availableCourses = []) {
        if (!selectedCourses.length) return availableCourses;

        return _.intersection(selectedCourses, availableCourses);
    }

    async enrollStudent(studentData) {
        // Data validation
        const result = await this.validators.student.enrollStudent(studentData);
        if (result) return result;

        const userDoc = await this.mongoModels.user.findOne({ _id: studentData.user });

        if (!userDoc) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'user not found',
                code: 404,
            });
        }

        const { user, classroom, courses, __roleAccess, res } = studentData;
        let classroomDoc = __roleAccess?.classroom;

        if (!classroomDoc) {
            classroomDoc = await this.mongoModels.classroom.getClassroomById(classroom);
        }

        if (classroomDoc && classroomDoc.students.length >= classroomDoc.capacity) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'classroom full',
                code: 409,
            });
        }

        let student = await this.mongoModels.student.findOne({ user });

        if (student) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'student already enrolled',
                code: 409,
            });
        }

        // Enrollment Logic
        if (!student) {
            student = await this.mongoModels.student.create({
                user,
                classroom,
                courses: this._getCoursesEnrolled(courses, classroomDoc?.courses),
            });
        }

        if (!classroomDoc.students.includes(user)) {
            classroomDoc.students.push(user);

            await classroomDoc.save();
        }

        return student;
    }

    async updateStudentProfile(studentData) {
        const { user, name, courses, email, res } = studentData;

        // Data validation
        const result = await this.validators.student.updateStudentProfile(studentData);
        if (result) return result;

        let student = await this.mongoModels.student.findOne({ user });

        if (!student) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'student not found',
                code: 404,
            });
        }

        // Update Logic

        if (courses) {
            const classroomDoc = await this.managers.classroom.getClassroomById(student.classroom);

            if (!classroomDoc) {
                return this.managers.responseDispatcher.dispatch(res, {
                    message: 'classroom not found',
                    code: 404,
                });
            }

            student.courses = this._getCoursesEnrolled(courses, classroomDoc?.courses);
            student = await student.save();
        }

        if (name || email) {
            const userDoc = await this.mongoModels.user.findOne({ _id: student.user });

            if (name) userDoc.name = name;
            if (email) userDoc.email = email;

            await userDoc.save();
        }

        return student;
    }

    async transferStudent(studentData) {
        // Data validation
        const result = await this.validators.student.transferStudent(studentData);
        if (result) return result;

        const { user, classroom, newClassroom, courses, __roleAccess, res } = studentData;

        if (classroom === newClassroom) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'student already in classroom',
                code: 409,
            });
        }

        let classroomDoc = __roleAccess?.classroom;

        if (!classroomDoc) {
            classroomDoc = await this.managers.classroom.getClassroomById(classroom);
        }

        if (!classroomDoc) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'classroom not found',
                code: 404,
            });
        }

        const newClassroomDoc = await this.managers.classroom.getClassroomById(newClassroom);

        if (!newClassroomDoc) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'new classroom not found',
                code: 404,
            });
        }

        if (newClassroomDoc.students.length >= newClassroomDoc.capacity) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'new classroom full',
                code: 409,
            });
        }

        let student = await this.mongoModels.student.findOne({ user });

        if (!student) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'student not found',
                code: 404,
            });
        }

        // Transfer student Logic
        if (newClassroom) {
            student.classroom = classroom;
            student.courses = this._getCoursesEnrolled(courses, newClassroomDoc?.courses);
            student = await student.save();
        }

        if (!newClassroomDoc.students.includes(user)) {
            newClassroomDoc.students.push(user);
            await newClassroomDoc.save();
        }

        if (classroomDoc.students.includes(user)) {
            classroomDoc.students = classroomDoc.students.filter((id) => id.toString() !== user);
            await classroomDoc.save();
        }

        return student;
    }
};
