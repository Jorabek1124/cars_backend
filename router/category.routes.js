

const { Router } = require("express");
const auth = require('../middleware/auth.middleware');
const categoryController = require('../controller/category.controller');
const upload = require("../middleware/category_upload");

const categoryRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Kategoriyalar (brandlar) bilan ishlash uchun API
 */

/**
 * @swagger
 * /add_brand:
 *   post:
 *     summary: Yangi brand (kategoriya) qo'shish
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - image
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Brand nomi
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Brand rasmi
 *     responses:
 *       201:
 *         description: Brand muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Ruxsat yo'q
 *       500:
 *         description: Server xatosi
 */
categoryRouter.post('/add_brand', auth(['admin']), upload.single('image'), categoryController.create);

/**
 * @swagger
 * /getall_brand:
 *   get:
 *     summary: Barcha brandlarni olish
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Barcha brandlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server xatosi
 */
categoryRouter.get('/getall_brand', categoryController.getAll);

/**
 * @swagger
 * /getone_brand/{id}:
 *   get:
 *     summary: Bitta brandni ID bo'yicha olish
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID si
 *     responses:
 *       200:
 *         description: Brand ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Brand topilmadi
 *       500:
 *         description: Server xatosi
 */
categoryRouter.get('/getone_brand/:id', categoryController.getOne);

/**
 * @swagger
 * /update_brand/{id}:
 *   put:
 *     summary: Brand ma'lumotlarini yangilash
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID si
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Brand nomi
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Brand rasmi
 *     responses:
 *       200:
 *         description: Brand ma'lumotlari muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Brand topilmadi
 *       500:
 *         description: Server xatosi
 */
categoryRouter.put('/update_brand/:id', auth(['admin']), upload.single('image'), categoryController.update);

/**
 * @swagger
 * /delete_brand/{id}:
 *   delete:
 *     summary: Brandni o'chirish
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID si
 *     responses:
 *       200:
 *         description: Brand muvaffaqiyatli o'chirildi
 *       401:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Brand topilmadi
 *       500:
 *         description: Server xatosi
 */
categoryRouter.delete('/delete_brand/:id', auth(['admin']), categoryController.delete);

module.exports = categoryRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - brand
 *         - image
 *       properties:
 *         brand:
 *           type: string
 *           description: Brand nomi
 *         image:
 *           type: string
 *           description: Brand rasmi URL manzili
 *       example:
 *         brand: "Toyota"
 *         image: "https://example.com/toyota.jpg"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */