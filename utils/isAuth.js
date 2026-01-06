function isAuth(req, res, next){
    if (req.isAuthenticated()){
        return next()
    } else{
        return res.redirect("/login")
    }
}

function errHandler(err, req, res, next){
    if (err){
        return res.status(400).send("ERROR 400!! PLEASE TRY AGAIN")
    }
}

function redirectLogin(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard")
    } 
    next()
}

module.exports = {isAuth, errHandler, redirectLogin}