const mongoose = require("mongoose")

const CarSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Kategoriya tanlash majburiy"]
    },
    model: {
        type: String,
        required: [true, "Model nomini kiritish majburiy"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Narxni kiritish majburiy"]
    },
    image: {
        type: String,
        required: [true, "Rasm yuklash majburiy"]
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const CarModel = mongoose.model("Car", CarSchema)

module.exports = CarModel