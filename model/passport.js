const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../lib/prisma')
const {isValid} = require('../utils/password')

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
}

const verifyCallback = async (username, password, done) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                username: username
            }
        })
        if (!user) {
            return done(null, false, {message: "Incorrect username or password"})
        }
        const valid = await isValid(password, user.password)
        if (!valid){
            return done(null, false, {message: "Incorrect username or password"})
        }
        return done(null, user)
    } catch(err){
        return done(err)
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback)
passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: userId
            }
        })
        done(null, user)
    } catch(err){
        done(err)
    }
})