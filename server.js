const express = require("express");
const expressLayouts = require("express-ejs-layouts")

const indexRouter = require("./routes/index")
const feeCalculator = require("./routes/fee_calculator")

const app = express()

const port = process.env.PORT || 8080;

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use("/styles", express.static(__dirname + "/static/styles"))
app.use(express.urlencoded({limit: "10mb", extended: false}))
app.use(expressLayouts)
app.use(express.static("public"))


app.use("/", indexRouter)
app.use("/fee_calculator", feeCalculator)

app.listen(port);
console.log('\nServer started at http://localhost:' + port);