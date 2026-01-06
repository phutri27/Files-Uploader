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

const specifyFileType =  (filetype) => {
  let type = "raw"
  const imageType = ["jpg", "jpeg", "png", "gif", "webp"]
  const videoType = ["mp4", "mov", "wav"]
  if (imageType.includes(filetype)) type = "image"
  if (videoType.includes(filetype)) type = "video"
  return type
}

const uploadFile = async (filePath, fileName) => {
  const result = fileName.split(".")
  const filetype = result[1].toLowerCase()
  const type = specifyFileType(filetype)
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
    const url = req.params.url
    const custom = req.params.name.split(".")
    
    const filetype = custom[1].toLowerCase()

    const file = await fileObj.selectFile(id)
    await fileObj.deleteFile(id)

    const tailType = specifyFileType(filetype)

    cloudinary.uploader.destroy(file.fileUrl, {resource_type: tailType})
    .then(result => console.log(result))

    res.redirect(req.header("Referer"))
  }

  const downloadAndShare = (req, res) => {
    const url = req.params.url
    const custom = req.params.name.split(".")

    const filetype = custom[1].toLowerCase()
    const type = specifyFileType(filetype)

    const downloadUrl = cloudinary.url(url, {
      flags: "attachment",
      resource_type: type
    })
    return downloadUrl
  }

  const downloadFile = async(req, res) => {
    const downloadUrl = downloadAndShare(req, res)
    res.redirect(downloadUrl)
  }

  const shareFile = async (req, res) => {
    const downloadUrl = downloadAndShare(req, res)
    req.session.folderData = {
      share: downloadUrl
    }
    return res.redirect(req.header("Referer"))
  }

  return {
    addFile,
    deleteFile,
    downloadFile,
    shareFile
  }
}

module.exports = {
    upload,
    fileController
}
