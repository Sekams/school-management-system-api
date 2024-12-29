module.exports = ({ meta, managers }) => {
    return async ({ req, res, next, results: { __token, __query } }) => {
        let user,
            school,
            classroom = null;

        try {
            const { moduleName, fnName } = req.params;

            // Allow access to 'auth' module without any checks
            if (moduleName === 'auth') {
                return next();
            }

            const userId = __token?.userId;
            user = await managers.user.getUserById(userId);

            // If user is not found, return unauthorized error
            if (!user) {
                return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
            }

            // Restrict students from accessing modules other than 'student' only to update their profile
            if (user.role === 'student' && (moduleName !== 'student' || fnName !== 'updateStudentProfile')) {
                return managers.responseDispatcher.dispatch(res, {
                    ok: false,
                    code: 403,
                    errors: 'resource forbidden',
                });
            }

            // Ensure students can only update their own profile
            if (
                user.role === 'student' &&
                moduleName === 'student' &&
                fnName === 'updateStudentProfile' &&
                req.body.user !== userId
            ) {
                return managers.responseDispatcher.dispatch(res, {
                    ok: false,
                    code: 403,
                    errors: 'resource forbidden',
                });
            }

            // Handle classroom and student modules
            if (['classroom', 'student'].includes(moduleName)) {
                const classroomId = req.body.classroom || req.query.classroom || __query?.classroom;

                if (classroomId) {
                    classroom = await managers.classroom.getClassroomById(classroomId);
                }

                const requestSchoolId = req.body.school || req.query.school || __query?.school;
                const classroomSchoolId = classroom?.school.toString();

                // Check for school mismatch
                if (classroomSchoolId && requestSchoolId && classroomSchoolId !== requestSchoolId) {
                    return managers.responseDispatcher.dispatch(res, {
                        ok: false,
                        code: 400,
                        errors: 'school mismatch',
                    });
                }

                const schoolId = requestSchoolId || classroomSchoolId;

                if (schoolId) {
                    school = await managers.school.getSchoolById(schoolId);
                }
            }

            // Admins must belong to the school they are trying to access
            if (user.role === 'admin' && ['classroom', 'student'].includes(moduleName)) {
                if (!school) {
                    return managers.responseDispatcher.dispatch(res, {
                        ok: false,
                        code: 400,
                        errors: 'school is required',
                    });
                }

                if (!school.administrators.includes(userId)) {
                    return managers.responseDispatcher.dispatch(res, {
                        ok: false,
                        code: 403,
                        errors: 'resource forbidden',
                    });
                }
            }

            // Restrict non-super-admins from accessing user and school modules
            if (user.role !== 'super-admin' && ['user', 'school'].includes(moduleName)) {
                return managers.responseDispatcher.dispatch(res, {
                    ok: false,
                    code: 403,
                    errors: 'resource forbidden',
                });
            }
        } catch (error) {
            console.log('failed to verify role', { error });
            return managers.responseDispatcher.dispatch(res, {
                ok: false,
                code: 500,
                errors: 'user role verification failed',
            });
        }

        // Proceed to the next middleware with user, school, and classroom data
        next({ user, school, classroom });
    };
};
