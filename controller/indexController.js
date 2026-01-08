const {UserObj} = require('../model/queries')
const bcrypt = require('bcrypt')
const {validateSignup} = require('./validator')
const {matchedData, validationResult} = require('express-validator')

function indexController(){
    const indexGet = (req, res) => {
        res.render("index", {
            connect: "/login",
            link: "Login"
        })
    }

    return {
        indexGet
    }
}

function loginController() {
    const loginGet = (req, res) => {
        if (req.isAuthenticated()){
            return res.redirect("/dashboard")
        }
        const errMsg = req.session.messages?.[0]
        const loginData = req.session.loginData || {}
        res.status(loginData.status || 200).render("login", {
            errors: errMsg || [],
            un: loginData.username || "",
            pww: loginData.password || ""
        })
        req.session.messages = []
        req.session.loginData = {}
    }

    const loginPost = (req, res, next) => {
        req.session.loginData = {
            status: 400,
            username: req.body.uname,
            password: req.body.pw
        }
        next()
    }

    return {
        loginGet,
        loginPost
    }
}

function signupController(){
    const signupGet = (req, res) => {
        const data = req.session.signupData || {}
        req.session.signupData = null
        res.status(data.status || 200).render("signup", {
            unameErr: data.unameErr,
            fnameErr: data.fnameErr,
            lnameErr: data.lnameErr,
            pwErr: data.pwErr,  
            rtErr: data.rtErr,
            uname: data.uname || "",
            fname: data.fname || "",
            lname: data.lname || "",
            pw: data.pw || "",
            rt: data.rt,
            errors: data.errors || []
        })
    }

    const signupPost =[...validateSignup ,
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                req.session.signupData = {
                    status: 400,
                    errors: errors.array(),
                    unameErr: "Username",
                    fnameErr: "First name",
                    lnameErr: "Last name",
                    pwErr: "Password must be",
                    rtErr: "match",
                    uname: req.body.username,
                    fname: req.body.first_name,
                    lname: req.body.last_name,
                    pw: req.body.password,
                    rt: req.body.retype
                }
                return res.redirect("/signup")
            }
            const {username, first_name, last_name, password} = matchedData(req)
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserObj.createUser(username, first_name, last_name, hashedPassword)
            res.redirect("/")
        }
    ]

    return {
        signupGet,
        signupPost
    }
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err){
            return next(err)
        }
        return res.redirect("/")
    })
}

module.exports ={
    indexController,
    loginController,
    signupController, 
    logout
}