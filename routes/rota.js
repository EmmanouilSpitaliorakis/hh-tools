const express = require("express")
const router = express.Router()


router.get("/", (req, res) =>{
    res.render("rota", {
        islogged: true,
        title: "Rota"
    })
})

module.exports = router