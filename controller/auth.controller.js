

const AuthModel = require("../schema/auth.schema");
const BaseError = require("../utils/base_error");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { AccessToken, RefreshToken } = require("../utils/generateToken");
const logger = require("../service/logger");

class AuthController {
    // Register
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            // Email va username uniqueligini tekshirish
            const existingUser = await AuthModel.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                throw BaseError.BadRequest(
                    existingUser.email === email 
                        ? "Bu email allaqachon ro'yxatdan o'tgan" 
                        : "Bu username allaqachon band"
                );
            }

            // Verification code generatsiya
            const verificationCode = Math.floor(100000 + Math.random() * 900000);

            // Nodemailer transport
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            // Email jo'natish
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "Tasdiqlash kodi",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Tasdiqlash kodi</h2>
                        <p>Hurmatli ${username},</p>
                        <p>Sizning tasdiqlash kodingiz:</p>
                        <h1 style="color: #007bff; font-size: 32px; margin: 20px 0;">${verificationCode}</h1>
                        <p style="color: #666;">Kod 2 daqiqa davomida amal qiladi.</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">
                            Agar siz ro'yxatdan o'tishni so'ramagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.
                        </p>
                    </div>
                `
            });

            // Parolni hashlash
            const hashedPassword = await bcrypt.hash(password, 12);

            // Yangi foydalanuvchi yaratish
            const user = await AuthModel.create({
                username,
                email,
                password: hashedPassword,
                verification_code: verificationCode
            });

            // Log yozish
            logger.info(`Yangi foydalanuvchi: ${username} ro'yxatdan o'tdi`, {
                username,
                email,
                action: "REGISTER",
                status: "success",
                date: new Date().toISOString()
            });

            // Verification code ni 2 daqiqadan keyin o'chirish
            setTimeout(async () => {
                await AuthModel.findByIdAndUpdate(user._id, { 
                    verification_code: null 
                });
            }, 120000);

            // Cookie o'rnatish
            res.cookie("email", email, { 
                httpOnly: true, 
                maxAge: 120000,
                secure: process.env.NODE_ENV === 'production'
            });

            res.status(201).json({
                success: true,
                message: "Foydalanuvchi yaratildi. Emailingizni tasdiqlang"
            });

        } catch (error) {
            logger.error(`Ro'yxatdan o'tishda xatolik: ${req.body?.email}`, {
                email: req.body?.email,
                username: req.body?.username,
                error: error.message,
                action: "REGISTER_ERROR",
                status: "failed",
                date: new Date().toISOString()
            });
            next(error);
        }
    }

    // Login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Foydalanuvchini topish
            const user = await AuthModel.findOne({ email });
            if (!user) {
                throw BaseError.BadRequest("Email yoki parol noto'g'ri");
            }

            // Parolni tekshirish
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw BaseError.BadRequest("Email yoki parol noto'g'ri");
            }

            // Verification tekshirish
            if (!user.isverified) {
                throw BaseError.BadRequest("Akkount tasdiqlanmagan. Iltimos emailingizni tasdiqlang");
            }

            // Token payload
            const payload = {
                _id: user._id,
                email: user.email,
                role: user.role
            };

            // Tokenlarni generatsiya qilish
            const accessToken = AccessToken(payload);
            const refreshToken = RefreshToken(payload);

            // Cookielarni o'rnatish
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production'
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production'
            });

            // Log yozish
            logger.info(`Foydalanuvchi login qildi: ${user.username}`, {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                action: "LOGIN",
                status: "success",
                date: new Date().toISOString()
            });

            res.status(200).json({
                success: true,
                message: "Muvaffaqiyatli login",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            logger.error(`Login xatolik: ${req.body?.email}`, {
                email: req.body?.email,
                error: error.message,
                action: "LOGIN_ERROR",
                status: "failed",
                date: new Date().toISOString()
            });
            next(error);
        }
    }

    // Verify
    async verify(req, res, next) {
        try {
            const { code, email } = req.body;

            const user = await AuthModel.findOne({ email });
            if (!user) {
                throw BaseError.NotFound("Foydalanuvchi topilmadi");
            }

            if (Number(!user.verification_code)) {
                throw BaseError.BadRequest("Tasdiqlash kodi muddati tugagan. Qaytadan ro'yxatdan o'ting");
            }

            if (Number(code) !== Number(user.verification_code)) {
                throw BaseError.BadRequest("Noto'g'ri kod");
            }

            await AuthModel.findByIdAndUpdate(user._id, {
                isverified: true,
                verification_code: null
            });

            logger.info(`Foydalanuvchi tasdiqlandi: ${user.username}`, {
                userId: user._id,
                username: user.username,
                email: user.email,
                action: "VERIFY",
                status: "success",
                date: new Date().toISOString()
            });

            res.clearCookie("email");

            res.status(200).json({
                success: true,
                message: "Akkount tasdiqlandi"
            });

        } catch (error) {
            logger.error(`Verifikatsiya xatolik: ${req.body?.email}`, {
                email: req.body?.email,
                error: error.message,
                action: "VERIFY_ERROR",
                status: "failed",
                date: new Date().toISOString()
            });
            next(error);
        }
    }

    // Logout
    async logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            logger.info(`Foydalanuvchi tizimdan chiqdi`, {
                userId: req.user?._id,
                action: "LOGOUT",
                status: "success",
                date: new Date().toISOString()
            });

            res.status(200).json({
                success: true,
                message: "Muvaffaqiyatli chiqish"
            });

        } catch (error) {
            logger.error(`Logout xatolik`, {
                error: error.message,
                action: "LOGOUT_ERROR",
                status: "failed",
                date: new Date().toISOString()
            });
            next(error);
        }
    }
}

module.exports = new AuthController();
