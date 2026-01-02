const bcrypt = require('bcrypt')

async function isValid(password, matchPassword){
    const match = bcrypt.compare(password, matchPassword)
    return match
}

module.exports = {
    isValid
}