const fs = require('fs')
const path = require('path')

const lib = {};

lib.baseDir = path.join(__dirname, '../.data/')

lib.create = function (dir, filename, data, callback) {
    fs.open(`${this.baseDir}${dir}/${filename}.json`, 'wx', function (err, file_descriptor) {
        if (err && !file_descriptor)
        {
            callback('Could not create file maybe exists')
            return;
        }
        const stringData = JSON.stringify(data)

        fs.writeFile(file_descriptor, stringData, function (err) {
            callback(err)
            fs.close(file_descriptor, function(err) {
                console.log('Closed')
            })
        })
    })
}

lib.read = function (dir, filename, callback) {
    fs.readFile(`${this.baseDir}${dir}/${filename}.json`, 'utf-8', function (err, data) {
        callback(err, data)
    })
}

lib.update = function(dir, filename, data, callback) {
    fs.open(`${this.baseDir}${dir}/${filename}.json`, 'r+', function (err, file_descriptor) {
        if (err && !file_descriptor) {
            callback(err)
            return;
        }
        fs.ftruncate(file_descriptor, function (err) {
            if (!err) {
                fs.writeFile(file_descriptor, JSON.stringify(data), function(err) {
                    fs.close(file_descriptor, function(err) {})
                })
            }
        })
    })
}

module.exports = lib;