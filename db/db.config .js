const mongoose = require("mongoose")
require("dotenv").config()
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI,
    //   {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // }
  )
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.log(err.message))
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = connectDB