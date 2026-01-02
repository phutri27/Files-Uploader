const {matchedData, validationResult} = require('express-validator')
const {UserObj, folderObj} = require('../model/queries')
const {validateFolder} = require('./validator')

function dashboardController(){
    const dashboardGet = async (req, res) => {
        const folders = await folderObj.selectAllFolders()
        const data = req.session.dashboardData || {}
        req.session.dashboardData = null
        console.log(folders)
        res.status(data.status || 200 ).render("dashboard", {
            user: req.user,
            errors: data.errors || [],
            errMsg: data.errMsg || "",
            folders: folders,
        })
    }

    const dashboardPost = [
        ...validateFolder, 
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                req.session.dashboardData = {
                    status: 400,
                    errors: errors.array(),
                    errMsg: "Folder"
                }
                return res.redirect("/dashboard")
            }
            const {folderName} = matchedData(req)
            await folderObj.insertFolder(folderName, req.user.id)
            return res.redirect("/dashboard")
        }
    ]

    return {
        dashboardGet,
        dashboardPost
    }
}

function folderController(){

}

module.exports = {
    dashboardController
}