const express = require("express")
const dashboardRouter = express.Router()
const {dashboardController} = require('../controller/dashboardController')
const {folderController} = require('../controller/folderController') 
const {upload, fileController} = require('../controller/fileController')

dashboardRouter.get("/", dashboardController().dashboardGet)

dashboardRouter.post("/", dashboardController().dashboardPost)

dashboardRouter.post("/:id/delete", folderController().deleteFolder)
dashboardRouter.post("/:id/deleteFile", fileController().deleteFile)

dashboardRouter.get("/:idUpdate/update", folderController().updateFolderGet)
dashboardRouter.post("/:idUpdate/update", folderController().updateFolderPost)

dashboardRouter.post("/uploadFile", upload.single('fileName'), fileController().addFile)
dashboardRouter.get("/:url/:name/download", fileController().downloadFile)

dashboardRouter.get("/{*splat}", folderController().folderGet)
dashboardRouter.post("/{*splat}", folderController().folderPost)

module.exports = dashboardRouter