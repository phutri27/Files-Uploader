const express = require("express")
const router = express.Router()
const {indexController, loginController, signupController, logout} = require('../controller/indexController')
const passport = require("passport")
const {errHandler} = require('../utils/isAuth')
const {redirectLogin} = require('../utils/isAuth')
router.get("/", redirectLogin, indexController().indexGet)

router.get("/login", redirectLogin, loginController().loginGet)
router.post("/login", loginController().loginPost, passport.authenticate('local', {failureRedirect: "/login", successRedirect: "/dashboard", failureFlash:true, failureMessage:true}))

router.get("/signup", redirectLogin, signupController().signupGet)
router.post("/signup", signupController().signupPost)

router.post("/logout", logout, errHandler)
module.exports = router