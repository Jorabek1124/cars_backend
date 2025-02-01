const CategoryModel = require("../schema/category.schema")
const path = require('path')
const fs = require('fs')

const categoryController = {

    create: async (req, res, next) => {
        try {
            const { brand} = req.body
            const image = req.file ? `/uploads/categories/${req.file.filename}` : null
            
            if (!image) {
                return res.status(400).json({
                    message: "Rasm yuklash majburiy"
                })
            }

            const newCategory = await CategoryModel.create({ 
                brand,  
                image 
            })
            
            res.status(201).json({
                message: "Kategoriya muvaffaqiyatli qo'shildi",
                data: newCategory
            })
        } catch (error) {
        
            res.status(500).json({
                message: "Kategoriya qo'shishda xatolik yuz berdi",
                error: error.message
            })
            next(error)
        }
    },
    
    getAll: async (req, res) => {
      try {
          const categories = await CategoryModel.find()
        
          const categoriesWithFullImageUrl = categories.map(category => {
              const baseUrl = process.env.BASE_URL || 'http://localhost:4001' 
              return {
                  ...category._doc,
                  image: category.image ? `${baseUrl}${category.image}` : null
              }
          })

          res.status(200).json({
              message: "Barcha kategoriyalar",
              data: categoriesWithFullImageUrl
          })
      } catch (error) {
          res.status(500).json({
              message: "Kategoriyalarni olishda xatolik yuz berdi",
              error: error.message
          })
      }
  },

    getOne: async (req, res) => {
      try {
          const category = await CategoryModel.findById(req.params.id)
          
          if (!category) {
              return res.status(404).json({
                  message: "Kategoriya topilmadi"
              })
          }
  
          const baseUrl = process.env.BASE_URL || 'http://localhost:4001'
          const categoryWithFullImageUrl = {
              ...category._doc,
              image: category.image ? `${baseUrl}${category.image}` : null
          }
  
          res.status(200).json({
              message: `${category.brand} kategoriyasi topildi`,
              data: categoryWithFullImageUrl
          })
      } catch (error) {
          
          if (error.name === 'CastError') {
              return res.status(400).json({
                  message: "Noto'g'ri ID formati",
                  error: error.message
              })
          }
  
          res.status(500).json({
              message: "Kategoriyani olishda xatolik yuz berdi",
              error: error.message
          })
      }
  },

    update: async (req, res) => {
        try {
            const { brand } = req.body
            const categoryId = req.params.id
            
              const existingCategory = await CategoryModel.findById(categoryId)
            if (!existingCategory) {
                return res.status(404).json({
                    message: "Kategoriya topilmadi"
                })
            }

            const updateData = {}
            
            if (brand) {
                updateData.brand = brand
            }
            
            if (req.file) {
                updateData.image = `/uploads/categories/${req.file.filename}`
            }

            const updatedCategory = await CategoryModel.findByIdAndUpdate(
                categoryId,
                updateData,
                { new: true }
            )

            const baseUrl = process.env.BASE_URL || 'http://localhost:4001'
            const categoryWithFullImageUrl = {
                ...updatedCategory._doc,
                image: updatedCategory.image ? `${baseUrl}${updatedCategory.image}` : null
            }

            res.status(200).json({
                message: "Kategoriya muvaffaqiyatli yangilandi",
                data: categoryWithFullImageUrl
            })
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    message: "Noto'g'ri ID formati",
                    error: error.message
                })
            }

            res.status(500).json({
                message: "Kategoriyani yangilashda xatolik yuz berdi",
                error: error.message
            })
        }
    },

    delete: async (req, res) => {
        try {
            const categoryId = req.params.id

            const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId)
            
            if (!deletedCategory) {
                return res.status(404).json({
                    message: "Kategoriya topilmadi"
                })
            }

            if (deletedCategory.image) {
                const imagePath = path.join(__dirname, '..', deletedCategory.image)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }

            res.status(200).json({
                message: "Kategoriya muvaffaqiyatli o'chirildi",
                data: deletedCategory
            })
        } catch (error) {
          
            if (error.name === 'CastError') {
                return res.status(400).json({
                    message: "Noto'g'ri ID formati",
                    error: error.message
                })
            }

            res.status(500).json({
                message: "Kategoriyani o'chirishda xatolik yuz berdi",
                error: error.message
            })
        }
    }
}

module.exports = categoryController