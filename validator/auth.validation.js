const Joi = require('joi');

const authValidation = {
    register: Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.empty': 'Username kiritish majburiy',
                'string.min': 'Username kamida 3 ta belgidan iborat bo\'lishi kerak',
                'string.max': 'Username ko\'pi bilan 30 ta belgidan iborat bo\'lishi mumkin'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email kiritish majburiy',
                'string.email': 'Noto\'g\'ri email format'
            }),

        password: Joi.string()
            .min(6)
            .max(30)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
            .required()
            .messages({
                'string.empty': 'Parol kiritish majburiy',
                'string.min': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
                'string.max': 'Parol ko\'pi bilan 30 ta belgidan iborat bo\'lishi mumkin',
                'string.pattern.base': 'Parol kamida 1 ta katta harf, 1 ta kichik harf va 1 ta raqam o\'z ichiga olishi kerak'
            })
    }),

    login: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email kiritish majburiy',
                'string.email': 'Noto\'g\'ri email format'
            }),

        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Parol kiritish majburiy'
            })
    }),

    verify: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email kiritish majburiy',
                'string.email': 'Noto\'g\'ri email format'
            }),

        code: Joi.string()
            .length(6)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.empty': 'Kod kiritish majburiy',
                'string.length': 'Kod 6 ta raqamdan iborat bo\'lishi kerak',
                'string.pattern.base': 'Kod faqat raqamlardan iborat bo\'lishi kerak'
            })
    })
};

module.exports = authValidation;