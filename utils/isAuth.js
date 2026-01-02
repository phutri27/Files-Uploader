function isAuth(req, res, next){
    if (req.isAuthenticared()){
        return next()
    } else{
        return res.redirect("/login")
    }
}

module.exports = isAuth