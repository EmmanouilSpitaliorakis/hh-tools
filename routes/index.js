const express = require("express")
const router = express.Router()

router.get("/", (req, res) =>{
    res.render("index",{islogged: true})
})

module.exports = router