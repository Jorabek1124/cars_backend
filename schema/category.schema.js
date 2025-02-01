
  const mongoose = require("mongoose")

  const CategorySchema = new mongoose.Schema({
      brand: {
        type: String,
        required: [true, "Brend nomini kiritish majburiy"],
        unique: true
      },
      image: {
        type: String,
        required: [true, "Rasm yuklash majburiy"]
      }
    },
    {
      versionKey: false,
      timestamps: true,
    })
  
  const CategoryModel = mongoose.model("Category", CategorySchema)
  
  module.exports = CategoryModel