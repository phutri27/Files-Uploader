const {matchedData, validationResult} = require('express-validator')
const {UserObj, folderObj} = require('../model/queries')
const {validateFolder, validateInner} = require('./validator')
const prisma = require('../lib/prisma')

function dashboardController(){
    //controller cho render dashboard
    const dashboardGet = async (req, res) => {
        const id = await folderObj.findFolderByUserId(req.user.id)
        const folders = await folderObj.selectAllFolders(id[0].id, req.user.id)
        const data = req.session.folderData || {}
        req.session.folderData = null
        req.session.dataId = id[0].id
        const url = req.originalUrl.split("?")
        const editId = req.query.editId ? Number(req.query.editId) : null
        res.status(data.status || 200 ).render("folderTemplate", {
            title: "Dashboard",
            user: req.user,
            errors: data.errors || [],
            errMsg: data.errMsg || "",
            folders: folders,
            editId: editId,
            err: data.err || [],
            folderpath: url[0],
            exactPath: url[0]
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
            const {folderName} = matchedData(req)
            console.log(folderName)
            const id = await folderObj.findFolderByUserId(req.user.id)
            await folderObj.insertFolder(folderName, req.user.id, id[0].id)
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