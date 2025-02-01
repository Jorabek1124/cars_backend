const mongoose = require("mongoose");

const CarDetailsSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, "Mashina modeli ID si majburiy"],
    autopopulate: true
    },
  marka: {
      type: String,
      required: [true, "Marka ID si majburiy"]
    },
  price: {
      type: Number, 
      required: [true, "Narxni kiritish majburiy"]
    },
  tinting: {
      type: String,
      enum: ['Yoq', 'Bor'],
      default: 'Yoq'
  },
  motor: {
      type: String,
      required: [true, "Motor hajmini kiritish majburiy"]
  },
  year: {
      type: Number,
      required: [true, "Ishlab chiqarilgan yilini kiritish majburiy"]
  },
  color: {
      type: String,
      required: [true, "Rangini kiritish majburiy"]
  },
  distance: {
      type: Number,
      required: [true, "Yurgan masofasini kiritish majburiy"]
  },
  gearbook: {
      type: String,
      enum: ['Mexanika', 'Avtomat karobka'],
      required: [true, "Transmission turini kiritish majburiy"]
  },
  exteriorImages: [{
      type: String,
      required: [true, "Mashinaning tashqi rasmi majburiy"]
  }],
    interiorImages: [{
      type: String,
      required: [true, "Mashinaning ichki rasmi majburiy"]
  }],
  description: {
      type: String,
      required: [true, "Tavsif kiritish majburiy"]
  }
}, 
{
    versionKey: false,
    timestamps: true
});


CarDetailsSchema.pre('save', async function(next) {
  if (this.car) {
      try {
          const carModel = await mongoose.model('Car').findById(this.car);
          if (carModel) {
              const category = await mongoose.model('Category').findById(carModel.category);
              if (!category) {
                  throw new Error("Marka topilmadi");
              }
              this.marka = category.brand;
              this.price = carModel.price;
          } else {
              throw new Error("Bunday model topilmadi");
          }
      } catch (error) {
          next(error);
      }
  }
  next();
});



const CarDetailsModel = mongoose.model('CarDetails', CarDetailsSchema);

module.exports = CarDetailsModel;