const fs = require('fs');

function getFileContent(path) {
    return fs.readFileSync(path, { encoding: 'utf-8' });
}

module.exports = {
    getFileContent,
}