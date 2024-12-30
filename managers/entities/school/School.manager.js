module.exports = class School {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;
        this.utils = utils;
        this.schoolsCollection = 'School';
        this.userExposed = [
            'post=createSchool',
            'get=findSchool',
            'get=getSchools',
            'patch=updateSchool',
            'delete=deleteSchool',
        ];
    }

    async createSchool(schoolData) {
        const { name, desc, administrators, res } = schoolData;

        const slug = this.utils.slugify(name);

        // Data validation
        const result = await this.validators.school.createSchool(schoolData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        let school = await this.mongoModels.school.findOne({ slug });

        if (school) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'School already exists',
                code: 409,
            });
        }

        // Creation Logic
        if (!school) {
            school = await this.mongoModels.school.create({ name, slug, desc, administrators });
        }

        return school;
    }

    async getSchools({ res }) {
        const schools = await this.mongoModels.school.find();

        if (!schools) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Schools not found',
                code: 404,
            });
        }

        return schools;
    }

    async getSchoolById(id) {
        const school = await this.mongoModels.school.findById({ _id: id });

        return school;
    }

    async findSchool({ __query, res }) {
        const { slug } = __query;

        // Data validation
        const result = await this.validators.school.findSchool(__query);
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const school = await this.mongoModels.school.findOne({ slug });

        if (!school) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'School not found',
                code: 404,
            });
        }

        return school;
    }

    async updateSchool(schoolData) {
        const { id, name, desc, administrators, res } = schoolData;

        // Data validation
        const result = await this.validators.school.updateSchool(schoolData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const school = await this.mongoModels.school.findOne({ _id: id });

        if (!school) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'School not found',
                code: 404,
            });
        }

        // Update Logic
        if (name) school.name = name;
        if (desc) school.desc = desc;
        if (administrators) school.administrators = administrators;

        const updatedSchool = await school.save();

        return updatedSchool;
    }

    async deleteSchool({ slug, res }) {
        // Data validation
        const result = await this.validators.school.findSchool({ slug });
        if (result) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: this.utils.consolidateValidations({ arr: result, key: 'message' }),
                code: 400,
            });
        }

        const deletedSchool = await this.mongoModels.school.findOneAndDelete({ slug });

        if (!deletedSchool) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'School not found',
                code: 404,
            });
        }

        return deletedSchool;
    }
};
