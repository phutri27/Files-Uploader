const {body} = require('express-validator')
const { Value } = require('sass')
const {UserObj, folderObj} = require('../model/queries')
const { empty } = require('@prisma/client/runtime/client')

const emptyErr = "must not be empty"
const alphaErr = "must only be letters"

exports.validateSignup = [
    body("username").trim()
    .notEmpty().withMessage(`Username ${emptyErr}`)
    .isLength({min: 6, max: 25}).withMessage("Username must be between 6 and 25 characters")
    .custom(async (value, {req}) => {
        const username = await UserObj.findUser(value)
        if (username){
            throw new Error("Username has been taken")
        }
        return true
    }),
    body("password")
    .notEmpty().withMessage(`Password ${emptyErr}`)
    .isLength({min: 6, max: 50}).withMessage("Password must be between 6 and 50 characters"),
    body("retype")
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error("Password does not match")
        }
        return true
    }),
    body("first_name").trim()
    .isLength({min: 1, max: 25}).withMessage("First name must have length between 1 and 25 characters")
    .bail()
    .isAlpha('en-US', {ignore: '\\s'}).withMessage(`First name ${alphaErr}`),
    body("last_name").trim()
    .isLength({min: 1, max: 25}).withMessage("Last name must have length between 1 and 25 characters")
    .bail()
    .isAlpha('en-US', {ignore: '\\s'}).withMessage(`Last name ${alphaErr}`),
]

exports.validateFolder = [
    body("folder").trim()
    .notEmpty().withMessage(`Folder name ${emptyErr}`)
    .custom(async (value, {req}) => {
        const folder = await folderObj.findTreeFolder(req.user.id, req.session.dataId, value)
        const val = value
        const r = req
        if (folder){
            throw new Error("Folder name has been taken")
        }
        return true
    })
]

exports.validateFile = [
    body("fileName")
    .custom((value, {req}) => {
        if (!req.file){
            throw new Error(`File ${emptyErr}`)
        }
        if  (req.file.size > 20 * 1024 * 1024){
            throw new Error("File too large (max 20MB)")
        }
        return true
    })
]