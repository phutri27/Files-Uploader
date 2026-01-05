const {matchedData, validationResult} = require('express-validator')
const {fileObj} = require('../model/queries')
const {validateFile} = require('./validator')
const cloudinary = require('../utils/cloudinary')

const multer = require('multer')
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

const uploadFile = async (filePath, fileName) => {
  const result = fileName.split(".")
  const filetype = result[1].toLowerCase()
  let type = "raw"
  const imageType = ["jpg", "jpeg", "png", "gif", "webp"]
  const videoType = ["mp4", "mov", "wav"]
  if (imageType.includes(filetype)) type = "image"
  if (videoType.includes(filetype)) type = "video"
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      resource_type: type
    }, (err, result) =>{
      if (err) return reject(err)
      return resolve(result)
    })
  })
}
// lam not validate file
function fileController(){
  const addFile = [
    ...validateFile, 
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()){
        req.session.folderData = {
          status: 400,
          fileErr: errors.array(),
          errFileMsg: "File"
        }
        return res.redirect(req.header("Referer"))
      }
      const result = await uploadFile(req.file.path, req.file.originalname)
      const url = result.public_id
      const folderId = req.session.current.id 
      await fileObj.createFile(req.file.originalname, req.file.size, folderId, url)
      return res.redirect(req.header("Referer"))
    }
  ]

  const deleteFile = async(req, res) => {
    const id = Number(req.params.id)
    await fileObj.deleteFile(id)
    res.redirect(req.header("Referer"))
  }

  const downloadFile = async(req, res) => {
    const url = req.params.url
    const custom = req.params.name.split(".")
    let type = "raw"
    const filetype = custom[1].toLowerCase()
    const imageType = ["jpg", "jpeg", "png", "gif", "webp"]
    const videoType = ["mp4", "mov", "wav"]
    if (imageType.includes(filetype)) type = "image"
    if (videoType.includes(filetype)) type = "video"
    const downloadUrl = cloudinary.url(url, {
      flags: "attachment",
      resource_type: type
    })

    res.redirect(downloadUrl)

  }

  return {
    addFile,
    deleteFile,
    downloadFile
  }
}

module.exports = {
    upload,
    fileController
}
