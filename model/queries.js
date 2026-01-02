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
                password: password
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

    async insertFolder(folderName, userId){
        const folder = await prisma.folder.create({
            data:{
                name: folderName,
                userId: userId
            }
        })
    }

    async selectAllFolders(){
        const folders = await prisma.folder.findMany()
        return folders
    }
}

const UserObj = new User()
const folderObj = new Folder()
module.exports = {
    UserObj,
    folderObj
}