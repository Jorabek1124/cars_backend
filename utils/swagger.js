const swaggerJSDoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "Foydalanuvchilarni ro'yxatga olish, mualliflar va kitoblar haqida umumiy ma'lumotlar.",
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    
                },
            },
        },
    },
    apis: ["./router/*.js"],
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec