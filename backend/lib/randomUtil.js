const crypto = require('crypto')

function generateId() {
    const id = crypto.randomBytes(8)
    .toString('base64')
    .toLowerCase()
    .replace(/[=+/?&]/g, '')
    .substring(0, 4);

    return id;
}

module.exports = {
    generateId: generateId
  }