const {matchedData, validationResult} = require('express-validator')
const {UserObj, folderObj} = require('../model/queries')
const {validateFolder, validateInner} = require('./validator')
const prisma = require('../lib/prisma')

function folderController(){
    const folderGet = async (req, res, next) => {
        try {
            const url = req.params.splat
            if (url[url.length - 1] == '')
                url.pop()
            const userId = req.user.id
            let root = await folderObj.findFolderByUserId(userId)

            let parentId = root[0].id
            let currentFolder = null

            for (const name of url){
                currentFolder = await folderObj.findTreeFolder(userId, parentId, name)
                parentId = currentFolder.id
            }
            req.session.current = currentFolder
            const path = url.join("/")
            const folders = await folderObj.selectAllFolders(currentFolder.id, userId)
            const editId = req.query.editId ? Number(req.query.editId) : null
            const originalUrl = req.originalUrl.split("?")
            const data = req.session.folderData || {}
            req.session.folderData = null
            res.status(data.status || 200).render("folderTemplate",{
                user: req.user,
                title: currentFolder.name,
                folderpath: originalUrl[0],
                exactPath: url,
                errors: data.errors || [],
                errMsg: "Folder",
                folders: folders,
                editId: editId,
            })
        } catch (error) {
            
        }
    }

    const folderPost = [
        ...validateFolder,
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                req.session.folderData = {
                    status: 400,
                    errMsg: "Folder",
                    errors: errors.array()
                }
                return res.redirect(req.originalUrl)
            }
            const {folder} = matchedData(req)

            await folderObj.insertFolder(folder, req.user.id, req.session.current.id)
            res.redirect(req.originalUrl)
        }
    ]

    const deleteFolder = async (req, res) => {
        const id = Number(req.params.id)
        await folderObj.deleteFolderById(id)
        res.redirect(req.header('Referer'))
    }

    const updateFolderGet = async (req, res) => {
        const id = Number(req.params.idUpdate)
        const referer = req.header("Referer")
        const base = referer.split("?")[0]
        return res.redirect(`${base}?editId=${id}`)
    }

    const updateFolderPost = [
        ...validateFolder,
        async (req, res) => {
            const id = Number(req.params.idUpdate)
            const referer = req.header("Referer")
            const base = referer.split("?")[0]
            const errors = validationResult(req)
            if  (!errors.isEmpty()){
                req.session.folderData = {
                    status: 400,
                    errors: errors.array(),
                    errMsg: "Folder"
                }
                return res.redirect(referer)
            }
            const {folder} = matchedData(req)
            await folderObj.updateFolderById(id, folder)
            res.redirect(base)
    }]

    return {
        folderGet,
        folderPost,
        deleteFolder,
        updateFolderGet,
        updateFolderPost
    }
}

module.exports = {
    folderController
}