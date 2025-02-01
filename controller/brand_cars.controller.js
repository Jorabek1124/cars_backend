const CarModel = require("../schema/brand_cars");
const CategoryModel = require("../schema/category.schema");
const fs = require('fs').promises;
const path = require('path');

const brand_carsController = {
  create: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Rasm yuklash majburiy"
        });
      }
  
      const categoryExists = await CategoryModel.findById(req.body.category);
      if (!categoryExists) {
        await fs.unlink(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Kategoriya topilmadi"
        });
      }
  
      const { category, model, price } = req.body;
      const image = `/uploads/${req.file.filename}`;
  
      const newCar = await CarModel.create({
        category,
        model,
        price,
        image
      });
  
      // Populate qilib to'liq ma'lumotni qaytarish
      const populatedCar = await CarModel.findById(newCar._id).populate('category');
  
      res.status(201).json({
        success: true,
        data: populatedCar,
        message: "Mashina muvaffaqiyatli qo'shildi"
      });
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },
  // READ - Barcha mashinalarni olish
  getAll: async (req, res) => {
    try {
      const cars = await CarModel.find().populate('category');
      
      res.status(200).json({
        success: true,
        data: cars
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

// READ - Kategoriya bo'yicha mashinalarni olish
  getCarsByCategory: async (req, res) => {
    try {
      const cars = await CarModel.find({ category: req.params.categoryId })
                                .populate('category');
      
      res.status(200).json({
        success: true,
        data: cars
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

// READ - Bitta mashinani ID bo'yicha olish
  getCarById: async (req, res) => {
    try {
      const car = await CarModel.findById(req.params.id).populate('category');
      
      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Mashina topilmadi"
        });
      }

      res.status(200).json({
        success: true,
        data: car
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

// UPDATE - Mashinani yangilash
  update: async (req, res) => {
    try {
      const car = await CarModel.findById(req.params.id);
      
      if (!car) {
        if (req.file) {
          await fs.unlink(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: "Mashina topilmadi"
        });
      }

      // Agar kategoriya o'zgartirilayotgan bo'lsa, yangi kategoriya mavjudligini tekshirish
      if (req.body.category) {
        const categoryExists = await CategoryModel.findById(req.body.category);
        if (!categoryExists) {
          if (req.file) {
            await fs.unlink(req.file.path);
          }
          return res.status(404).json({
            success: false,
            message: "Kategoriya topilmadi"
          });
        }
      }

      const updateData = {
        category: req.body.category || car.category,
        model: req.body.model || car.model,
        price: req.body.price || car.price,
        available: req.body.available !== undefined ? req.body.available : car.available
      };

      // Agar yangi rasm yuklangan bo'lsa
      if (req.file) {
        // Eski rasmni o'chirish
        if (car.image) {  // Eski rasm bor bo'lsagina
          const oldImagePath = path.join('public', car.image);
          try {
            await fs.unlink(oldImagePath);
          } catch (error) {
            console.log('Eski rasm topilmadi');
          }
        }
        
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedCar = await CarModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('category');

      res.status(200).json({
        success: true,
        data: updatedCar,
        message: "Mashina muvaffaqiyatli yangilandi"
      });
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join('public/uploads', req.file.filename));
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

}

module.exports = brand_carsController