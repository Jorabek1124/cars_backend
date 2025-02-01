

const { Router } = require("express");
const carDetailsController = require('../controller/carDetails.controller');
const upload = require('../middleware/car.upload');
const auth = require('../middleware/auth.middleware');

const carDetailsRouter = Router();

const uploadFields = upload.fields([
    { name: 'exteriorImages', maxCount: 10 },
    { name: 'interiorImages', maxCount: 10 }
]);

/**
 * @swagger
 * tags:
 *   name: Car Details
 *   description: Avtomobil tafsilotlari bilan ishlash uchun API
 */

/**
 * @swagger
 * /add_car_details:
 *   post:
 *     summary: Yangi avtomobil tafsilotlarini qo'shish
 *     tags: [Car Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - car
 *               - tinting
 *               - motor
 *               - year
 *               - color
 *               - distance
 *               - gearbook
 *               - exteriorImages
 *               - interiorImages
 *               - description
 *             properties:
 *               car:
 *                 type: string
 *                 description: Avtomobil modeli ID si
 *               tinting:
 *                 type: string
 *                 enum: [Yoq, Bor]
 *                 description: Tinting mavjudligi
 *               motor:
 *                 type: string
 *                 description: Motor hajmi
 *               year:
 *                 type: number
 *                 description: Ishlab chiqarilgan yili
 *               color:
 *                 type: string
 *                 description: Rang
 *               distance:
 *                 type: number
 *                 description: Yurgan masofasi
 *               gearbook:
 *                 type: string
 *                 enum: [Mexanika, Avtomat karobka]
 *                 description: Karobka turi
 *               exteriorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Tashqi rasmlar
 *               interiorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Ichki rasmlar
 *               description:
 *                 type: string
 *                 description: Tavsif
 *     responses:
 *       201:
 *         description: Avtomobil tafsilotlari muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Ruxsat yo'q
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.post('/add_car_details', auth(['admin']), uploadFields, carDetailsController.create);

/**
 * @swagger
 * /get_car_details/{id}:
 *   get:
 *     summary: Bitta avtomobil tafsilotlarini olish
 *     tags: [Car Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil tafsilotlari ID si
 *     responses:
 *       200:
 *         description: Avtomobil tafsilotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *       404:
 *         description: Avtomobil tafsilotlari topilmadi
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.get('/get_car_details/:id', carDetailsController.getOne);

/**
 * @swagger
 * /get_all_car_details:
 *   get:
 *     summary: Barcha avtomobil tafsilotlarini olish
 *     tags: [Car Details]
 *     responses:
 *       200:
 *         description: Barcha avtomobil tafsilotlari ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarDetails'
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.get('/get_all_car_details', carDetailsController.getAll);

/**
 * @swagger
 * /get_exterior_details/{id}:
 *   get:
 *     summary: Avtomobilning tashqi rasmlarini olish
 *     tags: [Car Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil tafsilotlari ID si
 *     responses:
 *       200:
 *         description: Tashqi rasmlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: Avtomobil tafsilotlari topilmadi
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.get('/get_exterior_details/:id', carDetailsController.getExteriorDetails);

/**
 * @swagger
 * /get_interior_details/{id}:
 *   get:
 *     summary: Avtomobilning ichki rasmlarini olish
 *     tags: [Car Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil tafsilotlari ID si
 *     responses:
 *       200:
 *         description: Ichki rasmlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: Avtomobil tafsilotlari topilmadi
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.get('/get_interior_details/:id', carDetailsController.getInteriorDetails);

/**
 * @swagger
 * /update_car_details/{id}:
 *   put:
 *     summary: Avtomobil tafsilotlarini yangilash
 *     tags: [Car Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil tafsilotlari ID si
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               car:
 *                 type: string
 *                 description: Avtomobil modeli ID si
 *               tinting:
 *                 type: string
 *                 enum: [Yoq, Bor]
 *                 description: Tinting mavjudligi
 *               motor:
 *                 type: string
 *                 description: Motor hajmi
 *               year:
 *                 type: number
 *                 description: Ishlab chiqarilgan yili
 *               color:
 *                 type: string
 *                 description: Rang
 *               distance:
 *                 type: number
 *                 description: Yurgan masofasi
 *               gearbook:
 *                 type: string
 *                 enum: [Mexanika, Avtomat karobka]
 *                 description: Karobka turi
 *               exteriorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Tashqi rasmlar
 *               interiorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Ichki rasmlar
 *               description:
 *                 type: string
 *                 description: Tavsif
 *     responses:
 *       200:
 *         description: Avtomobil tafsilotlari muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Avtomobil tafsilotlari topilmadi
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.put('/update_car_details/:id', auth(['admin']), uploadFields, carDetailsController.update);

/**
 * @swagger
 * /delete_car_details/{id}:
 *   delete:
 *     summary: Avtomobil tafsilotlarini o'chirish
 *     tags: [Car Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Avtomobil tafsilotlari ID si
 *     responses:
 *       200:
 *         description: Avtomobil tafsilotlari muvaffaqiyatli o'chirildi
 *       401:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Avtomobil tafsilotlari topilmadi
 *       500:
 *         description: Server xatosi
 */
carDetailsRouter.delete('/delete_car_details/:id', auth(['admin']), carDetailsController.delete);

module.exports = carDetailsRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     CarDetails:
 *       type: object
 *       required:
 *         - car
 *         - tinting
 *         - motor
 *         - year
 *         - color
 *         - distance
 *         - gearbook
 *         - exteriorImages
 *         - interiorImages
 *         - description
 *       properties:
 *         car:
 *           type: string
 *           description: Avtomobil modeli ID si
 *         marka:
 *           type: string
 *           description: Avtomobil markasi
 *         price:
 *           type: number
 *           description: Narx
 *         tinting:
 *           type: string
 *           enum: [Yoq, Bor]
 *           description: Tinting mavjudligi
 *         motor:
 *           type: string
 *           description: Motor hajmi
 *         year:
 *           type: number
 *           description: Ishlab chiqarilgan yili
 *         color:
 *           type: string
 *           description: Rang
 *         distance:
 *           type: number
 *           description: Yurgan masofasi
 *         gearbook:
 *           type: string
 *           enum: [Mexanika, Avtomat karobka]
 *           description: Karobka turi
 *         exteriorImages:
 *           type: array
 *           items:
 *             type: string
 *           description: Tashqi rasmlar URL manzillari
 *         interiorImages:
 *           type: array
 *           items:
 *             type: string
 *           description: Ichki rasmlar URL manzillari
 *         description:
 *           type: string
 *           description: Tavsif
 *       example:
 *         car: "64f1b1b1b1b1b1b1b1b1b1b1"
 *         marka: "Toyota"
 *         price: 30000
 *         tinting: "Bor"
 *         motor: "2.0L"
 *         year: 2020
 *         color: "Qora"
 *         distance: 15000
 *         gearbook: "Avtomat karobka"
 *         exteriorImages: ["https://example.com/exterior1.jpg", "https://example.com/exterior2.jpg"]
 *         interiorImages: ["https://example.com/interior1.jpg", "https://example.com/interior2.jpg"]
 *         description: "Yangi avtomobil, ajoyib holatda"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */