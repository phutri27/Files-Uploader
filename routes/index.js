const express = require("express")
const router = express.Router()
const {indexController, loginController, signupController} = require('../controller/indexController')
const passport = require("passport")

router.get("/", indexController().indexGet)

router.get("/login", loginController().loginGet)
router.post("/login", loginController().loginPost, passport.authenticate('local', {failureRedirect: "/login", successRedirect: "/dashboard", failureFlash:true, failureMessage:true}))

router.get("/signup",signupController().signupGet)
router.post("/signup", signupController().signupPost)
module.exports = router