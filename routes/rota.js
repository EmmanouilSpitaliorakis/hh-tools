const express = require("express")
const router = express.Router()


router.get("/", (req, res) =>{
    res.render("rota", {
        islogged: true,
    })
})

module.exports = router