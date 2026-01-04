const express = require("express")
const dashboardRouter = express.Router()
const {dashboardController} = require('../controller/dashboardController')
const {folderController} = require('../controller/folderController') 

dashboardRouter.get("/", dashboardController().dashboardGet)

dashboardRouter.post("/", dashboardController().dashboardPost)

dashboardRouter.post("/:id/delete", folderController().deleteFolder)

dashboardRouter.get("/:idUpdate/update", folderController().updateFolderGet)
dashboardRouter.post("/:idUpdate/update", folderController().updateFolderPost)

dashboardRouter.get("/{*splat}", folderController().folderGet)
dashboardRouter.post("/{*splat}", folderController().folderPost)

module.exports = dashboardRouter