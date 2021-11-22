const express = require("express")
const router = express.Router()

router.get("/", (req, res) =>{
    res.render("index",{
        islogged: true,
        title: "HH Tools"
    })
})

module.exports = router