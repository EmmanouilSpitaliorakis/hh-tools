const express = require("express")
const router = express.Router()


islogged = false

router.get("/", (req, res) =>{
    res.render("login",{
        islogged: islogged,
        title: "Login"
    })
})

module.exports = router