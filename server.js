const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
require("dotenv").config();


// Route Imports 
const indexRouter = require("./routes/index")
const feeCalculatorRouter = require("./routes/fee_calculator")
const rotaRouter = require("./routes/rota")
const loginRouter = require("./routes/login")
const depositlessRouter = require("./routes/depositless")



// Middleware
const app = express()
const port = process.env.PORT || 8080;
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use("/styles", express.static(__dirname + "/static/styles"))
app.use("/icns", express.static(__dirname + "/static/icns"))
app.use(express.urlencoded({limit: "10mb", extended: false}))
app.use(expressLayouts)
app.use(express.static("public"))

const uri = process.env.MONGO_URI

// await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true})
// const connection = mongoose.connection

// connection.once("open", ()=>{
//     console.log("MongoFB database conneciton establish successfully")
// })


// Routes
app.use("/", indexRouter)
app.use("/fee_calculator", feeCalculatorRouter)
app.use("/rota", rotaRouter)
app.use("/login", loginRouter)
app.use("/depositless", depositlessRouter)

app.listen(port);
console.log('\nServer started at http://localhost:' + port);