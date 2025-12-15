"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
const Validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            res.status(400).json({ errors });
            return;
        }
        const user = {
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            password: result.data.password,
            role: result.data.role,
        };
        //   console.log(result)
        req.body = user;
        next();
    };
};
exports.Validate = Validate;
