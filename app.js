const http = require('http');
const fs = require('fs')
const path = require('path');
var express = require('express')
var app = express()

const hostname = '127.0.0.1';
const port = 3000;

var imageBasePath = '/mnt/e/users/sng/pictures/'

const imageFiles = getImagesRecursive(imageBasePath)
app.use(express.static(imageBasePath))
app.use(express.static(__dirname))


var server = app.listen(3000, () => {
    console.log("Running server...")
})


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"))
})

app.get('/images', function (req, res) {
  res.send(imageFiles)
})


function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function isImage(path) {
    return path.toLowerCase().includes(".jpg") || path.toLowerCase().includes(".jpeg") || path.toLowerCase().includes(".png") || path.toLowerCase().includes(".heic")
}

function getImagesRecursive(src) {
    var paths = fs.readdirSync(src).map(file => path.join(src, file))
    var folders = paths.filter(path => fs.statSync(path).isDirectory())
    var images = paths.filter(path => isImage(path))
    return images.concat(flatten(folders.map(getImagesRecursive)));
}