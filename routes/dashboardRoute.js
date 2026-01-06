const express = require("express")
const dashboardRouter = express.Router()
const {dashboardController} = require('../controller/dashboardController')
const {folderController} = require('../controller/folderController') 
const {upload, fileController} = require('../controller/fileController')

const dashboard = dashboardController()
const file = fileController()
const folder = folderController()
dashboardRouter.get("/", dashboard.dashboardGet)

dashboardRouter.post("/", dashboard.dashboardPost)

dashboardRouter.post("/:id/delete", folder.deleteFolder)
dashboardRouter.post("/:id/:url/:name/deleteFile", file.deleteFile)

dashboardRouter.get("/:idUpdate/update", folder.updateFolderGet)
dashboardRouter.post("/:idUpdate/update", folder.updateFolderPost)

dashboardRouter.post("/uploadFile", upload.single('fileName'), file.addFile)
dashboardRouter.get("/:url/:name/download", file.downloadFile)
dashboardRouter.post("/:url/:name/share", file.shareFile)

dashboardRouter.get("/{*splat}", folder.folderGet)
dashboardRouter.post("/{*splat}", folder.folderPost)

module.exports = dashboardRouter