const BaseError = require('../utils/base_error');

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: true
            });

            if (error) {
                const errorMessage = error.details
                    .map((detail) => detail.message)
                    .join(', ');
                
                throw BaseError.BadRequest(errorMessage);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validate; 