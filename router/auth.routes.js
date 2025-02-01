
const express = require("express");
const { Router } = require("express");
const AuthController = require("../controller/auth.controller");
const validate = require("../middleware/validate.middleware");
const authValidation = require("../validator/auth.validation");
const auth = require("../middleware/auth.middleware");

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Foydalanuvchi autentifikatsiyasi va ro'yxatdan o'tish
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       500:
 *         description: Server xatosi
 */
authRouter.post(
  "/register",
  validate(authValidation.register),
  AuthController.register
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli tizimga kirdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Kirish rad etildi
 *       500:
 *         description: Server xatosi
 */
authRouter.post("/login", validate(authValidation.login), AuthController.login);

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Foydalanuvchi hisobini tasdiqlash
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Verify'
 *     responses:
 *       200:
 *         description: Foydalanuvchi hisobi muvaffaqiyatli tasdiqlandi
 *       400:
 *         description: Noto'g'ri tasdiqlash kodi
 *       500:
 *         description: Server xatosi
 */
authRouter.post("/verify", validate(authValidation.verify), AuthController.verify);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Foydalanuvchi tizimdan chiqishi
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli tizimdan chiqdi
 *       401:
 *         description: Kirish rad etildi
 *       500:
 *         description: Server xatosi
 */
authRouter.post("/logout", auth(), AuthController.logout);

module.exports = authRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Foydalanuvchi nomi
 *           minLength: 3
 *           maxLength: 30
 *         email:
 *           type: string
 *           format: email
 *           description: Foydalanuvchi elektron pochta manzili
 *         password:
 *           type: string
 *           format: password
 *           description: Foydalanuvchi paroli
 *           minLength: 6
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 *         password: "password123"
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Foydalanuvchi elektron pochta manzili
 *         password:
 *           type: string
 *           format: password
 *           description: Foydalanuvchi paroli
 *       example:
 *         email: "john@example.com"
 *         password: "password123"
 *
 *     Verify:
 *       type: object
 *       required:
 *         - email
 *         - verification_code
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Foydalanuvchi elektron pochta manzili
 *         verification_code:
 *           type: number
 *           description: Tasdiqlash kodi
 *       example:
 *         email: "john@example.com"
 *         verification_code: 123456
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */