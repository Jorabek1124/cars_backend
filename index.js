const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const path = require('path')  
const swaggerSpec = require("./utils/swagger")
const connectDB = require("./db/db.config ")
const categoryRouter = require("./router/category.routes")
const brand_carsRouter = require("./router/brand_cars.routes")
const carDetailsRouter = require("./router/car.details.routes")
const authRouter = require("./router/auth.routes")
const swaggerUI = require("swagger-ui-express")





dotenv.config({path: ".env"})
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({credentials: true}))
app.use(express.json())
app.use(cookieParser())


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

connectDB()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use(categoryRouter)
app.use(brand_carsRouter)
app.use(carDetailsRouter)
app.use(authRouter)




app.listen(PORT, () => {
  console.log("Server is running: " + PORT);
  })