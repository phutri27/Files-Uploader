const {matchedData, validationResult} = require('express-validator')
const {UserObj, folderObj, fileObj} = require('../model/queries')
const {validateFolder, validateInner} = require('./validator')
const prisma = require('../lib/prisma')

function dashboardController(){
    //controller cho render dashboard
    const dashboardGet = async (req, res) => {
        const id = await folderObj.findFolderByUserId(req.user.id)
        const folders = await folderObj.selectAllFolders(id.id, req.user.id)
        const files = await fileObj.selectAllFiles(id.id)
        const data = req.session.folderData || {}
        req.session.folderData = null
        req.session.current = id
        const url = req.originalUrl.split("?")
        const editId = req.query.editId ? Number(req.query.editId) : null
        res.status(data.status || 200 ).render("folderTemplate", {
            title: "Dashboard",
            user: req.user,
            errors: data.errors || [],  
            errMsg: data.errMsg || "",
            folders: folders,
            files: files,
            editId: editId,
            err: data.err || [],
            folderpath: url[0],
            exactPath: ["dashboard"],
            share: data.share || null
        })
    }
    //controller cho post dashboard
    const dashboardPost = [
        ...validateFolder, 
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                req.session.folderData = {
                    status: 400,
                    errors: errors.array(),
                    errMsg: "Folder"
                }
                return res.redirect("/dashboard")
            }
            const {folder} = matchedData(req)
            const id = await folderObj.findFolderByUserId(req.user.id)
            await folderObj.insertFolder(folder, req.user.id, id.id)
            return res.redirect("/dashboard")
        }
    ]

    return {
        dashboardGet,
        dashboardPost
    }
}

module.exports = {
    dashboardController,
}