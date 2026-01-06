const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./lib/prisma')
const assetsPath = path.join(__dirname, "public")
const index = require('./routes/index')
const dashboardRoute = require('./routes/dashboardRoute')
const flash = require('connect-flash')
const {isAuth, redirectLogin} = require('./utils/isAuth')

require('dotenv').config()
require('./model/passport')

const app = express();
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(flash())
app.use(passport.initialize())
app.use(passport.session()) 

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use("/", index)
app.use("/dashboard", isAuth, dashboardRoute)
app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
