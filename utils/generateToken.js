



const jwt = require('jsonwebtoken');

const AccessToken = (payload) => {
    return jwt.sign(
        {
            _id: payload._id,
            email: payload.email,
            role: payload.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

const RefreshToken = (payload) => {
    return jwt.sign(
        {
            _id: payload._id,
            email: payload.email,
            role: payload.role
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: '15d'
        }
    );
};

module.exports = {
    AccessToken,
    RefreshToken
};