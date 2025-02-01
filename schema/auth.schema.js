
const { model, Schema } = require("mongoose");

const authSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username kiritish majburiy"],
        trim: true,
        minlength: [3, "Username kamida 3 ta belgidan iborat bo'lishi kerak"],
        maxlength: [30, "Username ko'pi bilan 30 ta belgidan iborat bo'lishi mumkin"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email kiritish majburiy"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Parol kiritish majburiy"],
        minlength: [6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"]
    },
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "{VALUE} is not supported"
        },
        default: "user"
    },
    verification_code: {
        type: Number,
        required: true
    },
    isverified: {
        type: Boolean,
        default: false
    }
}, {
      versionKey: false,
      timestamps: true
});

module.exports = model("Auth", authSchema);