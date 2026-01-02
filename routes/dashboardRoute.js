const express = require("express")
const dashboardRouter = express.Router()
const {dashboardController} = require('../controller/dashboardController')

dashboardRouter.get("/", dashboardController().dashboardGet)

dashboardRouter.post("/folder", dashboardController().dashboardPost)
module.exports = dashboardRouter