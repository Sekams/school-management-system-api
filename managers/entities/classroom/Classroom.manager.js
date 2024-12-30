'use strict';
module.exports = class Classroom {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.utils = utils;
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;
        this.classroomsCollection = 'Classroom';
        this.userExposed = ['post=createClassroom', 'get=getClassrooms', 'get=findClassroom', 'patch=updateClassroom'];
    }

    async createClassroom(classroomData) {
        // Data validation
        const result = await this.validators.classroom.createClassroom(classroomData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(classroomData.res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const { name, capacity, school, courses, res } = classroomData;

        const slug = this.utils.slugify(name);

        const classroom = await this.mongoModels.classroom.findOne({ slug });

        if (classroom) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Classroom already exists',
                code: 409,
            });
        }

        // Creation Logic
        return await this.mongoModels.classroom.create({
            name,
            slug,
            capacity,
            school,
            courses,
        });
    }

    async getClassrooms({ __query, res }) {
        // Data validation
        const result = await this.validators.classroom.getClassrooms(__query);
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const classrooms = await this.mongoModels.classroom.find({ school: __query.school });

        if (!classrooms) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Classrooms not found',
                code: 404,
            });
        }

        return classrooms;
    }

    async findClassroom({ __query, res }) {
        // Data validation
        const result = await this.validators.classroom.findClassroom(__query);
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const classroom = await this.mongoModels.classroom.findOne({ slug: __query.slug, school: __query.school });

        if (!classroom) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Classroom not found',
                code: 404,
            });
        }

        return classroom;
    }

    async getClassroomById(id) {
        const classroom = await this.mongoModels.classroom.findById({ _id: id });

        return classroom;
    }

    async updateClassroom(classroomData) {
        // Data validation
        const result = await this.validators.classroom.updateClassroom(classroomData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(classroomData.res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const { id, name, capacity, school, newSchool, courses, res } = classroomData;

        const classroom = await this.mongoModels.classroom.findOne({ _id: id, school });

        if (!classroom) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'classroom not found',
                code: 404,
            });
        }

        // Update Logic
        if (name) classroom.name = name;
        if (capacity) classroom.capacity = capacity;
        if (newSchool) classroom.school = newSchool;
        if (courses) classroom.courses = courses;

        const updateClassroom = await classroom.save();

        return updateClassroom;
    }
};
