const { Connection } = require('pg')
const prisma = require('../lib/prisma')

class User{
    constructor(){

    }

    async createUser(username, firstName, lastName, password){
        const user = await prisma.user.create({
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                folders: {
                    create: {
                        name: "dashboard",
                    }
                }
            }
        })
    }

    async findUser(username){
        const user = await prisma.user.findUnique({
            where:{
                username: username
            }
        })
        return user
    }

}

class Folder{
    constructor(){

    }

    async insertFolder(folderName, userId, parentId){
        const folder = await prisma.folder.create({
            data:{
                name: folderName,
                userId: userId,
                parentId: parentId
            }
        })
    }

    async findFolderByUserId(userId){
        const folderId = await prisma.folder.findFirst({
            where: {
                AND : [{userId: userId}, {name: "dashboard"}]
            },
            select: 
            {id:true,
            name:true,
            parentId:true
            }
        })
        return folderId
    }

    async selectAllFolders(parentId, userId){
        const folders = await prisma.folder.findMany({
            where:{
                AND: [
                    {parentId: parentId},
                    {userId: userId},    
                ]
            }
        })
        return folders
    }

    async findTreeFolder(userId, parentId, name){
        const folder = await prisma.folder.findUnique({
            where: {
                userId_parentId_name: {userId, parentId, name}
            },
            select: {
                id: true,
                name: true,
                parentId: true
            }
        })
        return folder
    }

    async selectFoldersById(folderId){
        const path = await prisma.folder.findUnique({
            where:{
                id: folderId
            },
            select: {
                name:true
            }
        })
        return
    }

    async deleteFolderById(folderId){
        await prisma.folder.delete({
            where:{
                id:folderId
            }
        })
    }

    async updateFolderById(folderId, newName){
        await prisma.folder.update({
            where: {
                id: folderId
            },
            data:{
                name: newName
            }
        })
    }
}

class File{
    constructor(){

    }

    async createFile(name, size, folderId, url){
        await prisma.file.create({
            data:{
                fileName:name,
                fileSize:size,
                folderId: folderId,
                fileUrl: url
            }
        })
    }

    async selectAllFiles(folderId){
        const files = await prisma.file.findMany({
            where:{
                folderId:folderId,
            },
            select: {
                id: true,
                fileName: true,
                fileSize: true,
                fileUrl: true,
            }
        })
        return files
    }

    async selectFile(id){
        const file = await prisma.file.findUnique({
            where: {
                id: id
            },
            select: {
                fileUrl: true
            }
        })
        return file
    }

    async deleteFile(fileId){
        await prisma.file.delete({
            where:{
                id:fileId
            }
        })
    }
}

const UserObj = new User()
const folderObj = new Folder()
const fileObj = new File()
module.exports = {
    UserObj,
    folderObj,
    fileObj
}