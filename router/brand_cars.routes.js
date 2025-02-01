
const { Router } = require("express");
const brand_carsController = require('../controller/brand_cars.controller');
const upload = require("../middleware/cars.model.upload");
const auth = require('../middleware/auth.middleware');
const brand_carsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Avtomobillar bilan ishlash uchun API
 */

/**
 * @swagger
 * /add_cars:
 *   post:
 *     summary: Yangi avtomobil qo'shish
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - model
 *               - price
 *               - image
 *             properties:
 *               category:
 *                 type: string
 *                 description: Kategoriya ID si
 *               model:
 *                 type: string
 *                 description: Avtomobil modeli
 *               price:
 *                 type: number
 *                 description: Avtomobil narxi
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Avtomobil rasmi
 *     responses:
 *       201:
 *         description: Avtomobil muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       500:
 *         description: Server xatosi
 */
brand_carsRouter.post('/add_cars', auth(['admin']), upload.single('image'), brand_carsController.create);

/**
 * @swagger
 * /getall_cars:
 *   get:
 *     summary: Barcha avtomobillarni olish
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Barcha avtomobillar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Server xatosi
 */
brand_carsRouter.get('/getall_cars', brand_carsController.getAll);

/**
 * @swagger
 * /get_cars_by_category/{categoryId}:
 *   get:
 *     summary: Kategoriya bo'yicha avtomobillarni olish
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Kategoriya ID si
 *     responses:
 *       200:
 *         description: Kategoriya bo'yicha avtomobillar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       404:
 *         description: Kategoriya topilmadi
 *       500:
 *         description: Server xatosi
 */
brand_carsRouter.get('/get_cars_by_category/:categoryId', brand_carsController.getCarsByCategory);

/**
 * @swagger
 * /get_car_by_id/{id}:
 *   get:
 *     summary: Bitta avtomobilni ID bo'yicha olish
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil ID si
 *     responses:
 *       200:
 *         description: Avtomobil ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Avtomobil topilmadi
 *       500:
 *         description: Server xatosi
 */
brand_carsRouter.get('/get_car_by_id/:id', brand_carsController.getCarById);

/**
 * @swagger
 * /update_car/{id}:
 *   put:
 *     summary: Avtomobil ma'lumotlarini yangilash
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil ID si
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Kategoriya ID si
 *               model:
 *                 type: string
 *                 description: Avtomobil modeli
 *               price:
 *                 type: number
 *                 description: Avtomobil narxi
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Avtomobil rasmi
 *     responses:
 *       200:
 *         description: Avtomobil ma'lumotlari muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri so'rov
 *       404:
 *         description: Avtomobil topilmadi
 *       500:
 *         description: Server xatosi
 */
brand_carsRouter.put('/update_car/:id', auth(['admin']), upload.single('image'), brand_carsController.update);

module.exports = brand_carsRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - category
 *         - model
 *         - price
 *         - image
 *       properties:
 *         category:
 *           type: string
 *           description: Kategoriya ID si
 *         model:
 *           type: string
 *           description: Avtomobil modeli
 *         price:
 *           type: number
 *           description: Avtomobil narxi
 *         image:
 *           type: string
 *           description: Avtomobil rasmi URL manzili
 *         available:
 *           type: boolean
 *           description: Avtomobil mavjudligi
 *       example:
 *         category: "64f1b1b1b1b1b1b1b1b1b1b1"
 *         model: "Tesla Model S"
 *         price: 80000
 *         image: "https://example.com/tesla.jpg"
 *         available: true
 */

