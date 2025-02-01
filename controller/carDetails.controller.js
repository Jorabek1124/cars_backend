const CarDetails = require("../schema/car_details.schema");
const upload = require("../middleware/car.upload");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");

class CarDetailsController {
  async create(req, res, next) {
    try {
      const carModel = await mongoose.model("Car").findById(req.body.car);
      if (!carModel) {
        return res.status(404).json({
          success: false,
          error: "Bunday model topilmadi",
        });
      }

      const carDetails = new CarDetails({
        ...req.body,
        marka: carModel.category,
        price: carModel.price,
        exteriorImages: req.files.exteriorImages.map(
          (file) => `/uploads/cars/${file.filename}`
        ),
        interiorImages: req.files.interiorImages.map(
          (file) => `/uploads/cars/${file.filename}`
        ),
      });

      await carDetails.save();
      res.status(201).json({
        success: true,
        data: carDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      next(error);
    }
  }

  async getAll(req, res) {
    try {
      const carDetails = await CarDetails.find()
        .populate({
          path: "car",
          select: "name model year -_id",
        })
        .select(
          "_id marka price exteriorImages interiorImages description color engine transmission distance tinting condition fuel driveUnit mileage"
        );

      res.status(200).json({
        success: true,
        count: carDetails.length,
        data: carDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      const carDetails = await CarDetails.findById(req.params.id)
        .populate({
          path: "car",
          select: "name model year -_id",
        })
        .select(
          "_id marka price exteriorImages interiorImages description color engine transmission distance tinting condition fuel driveUnit mileage"
        );

      if (!carDetails) {
        return res.status(404).json({
          success: false,
          error: "Mashina topilmadi",
        });
      }

      res.status(200).json({
        success: true,
        data: carDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getExteriorDetails(req, res) {
    try {
      const carDetails = await CarDetails.findById(req.params.id)
        .populate({
          path: "car",
          select: "name model year -_id",
        })
        .select(
          "_id exteriorImages condition color mileage distance tinting fuel driveUnit engine transmission price description"
        );

      if (!carDetails) {
        return res.status(404).json({
          success: false,
          error: "Mashina topilmadi",
        });
      }

      res.status(200).json({
        success: true,
        data: carDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getInteriorDetails(req, res) {
    try {
      const carDetails = await CarDetails.findById(req.params.id)
        .populate({
          path: "car",
          select: "name model year -_id",
        })
        .select(
          "_id interiorImages condition color mileage distance tinting fuel driveUnit engine transmission price description"
        );

      if (!carDetails) {
        return res.status(404).json({
          success: false,
          error: "Mashina topilmadi",
        });
      }

      res.status(200).json({
        success: true,
        data: carDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const carDetails = await CarDetails.findById(req.params.id);
      if (!carDetails) {
        return res.status(404).json({
          success: false,
          error: "Mashina topilmadi",
        });
      }

      if (req.body.car) {
        const carModel = await mongoose.model("Car").findById(req.body.car);
        if (!carModel) {
          return res.status(404).json({
            success: false,
            error: "Bunday model topilmadi",
          });
        }
        req.body.marka = carModel.category;
        req.body.price = carModel.price;
      }

      if (req.files) {
        if (req.files.exteriorImages) {
          for (const imagePath of carDetails.exteriorImages) {
            const fullPath = path.join(__dirname, "..", "public", imagePath);
            await fs
              .unlink(fullPath)
              .catch((err) => console.log("Rasm topilmadi:", err));
          }
          req.body.exteriorImages = req.files.exteriorImages.map(
            (file) => `/uploads/cars/${file.filename}`
          );
        }
        if (req.files.interiorImages) {
          for (const imagePath of carDetails.interiorImages) {
            const fullPath = path.join(__dirname, "..", "public", imagePath);
            await fs
              .unlink(fullPath)
              .catch((err) => console.log("Rasm topilmadi:", err));
          }
          req.body.interiorImages = req.files.interiorImages.map(
            (file) => `/uploads/cars/${file.filename}`
          );
        }
      }

      const updatedCarDetails = await CarDetails.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate({
          path: "car",
          select: "name model year -_id",
        })
        .select(
          "_id marka price exteriorImages interiorImages description color engine transmission distance tinting condition fuel driveUnit mileage"
        );

      res.status(200).json({
        success: true,
        data: updatedCarDetails,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const carDetails = await CarDetails.findById(req.params.id);
      if (!carDetails) {
        return res.status(404).json({
          success: false,
          error: "Mashina topilmadi",
        });
      }

      for (const imagePath of [
        ...carDetails.exteriorImages,
        ...carDetails.interiorImages,
      ]) {
        const fullPath = path.join(__dirname, "..", "public", imagePath);
        await fs
          .unlink(fullPath)
          .catch((err) => console.log("Rasm topilmadi:", err));
      }

      await CarDetails.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Mashina ma'lumotlari o'chirildi",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new CarDetailsController();
