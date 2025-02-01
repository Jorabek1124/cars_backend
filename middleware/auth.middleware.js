const jwt = require('jsonwebtoken');
const BaseError = require('../utils/base_error');

const auth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            const token = req.cookies.accessToken;
            
            if (!token) {
                throw BaseError.UnauthorizedError("Token topilmadi");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                throw BaseError.ForbiddenError("Bu amalni bajarish uchun huquq yo'q");
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw BaseError.UnauthorizedError("Token muddati tugagan");
            }
            next(error);
        }
    };
};

module.exports = auth; 