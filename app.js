const avgColors = require('fast-average-color-node');
const http = require('http');
const fs = require('fs')
const path = require('path');
var express = require('express')
var app = express()

const hostname = '127.0.0.1';
const port = 3000;

const imageBasePath = '/mnt/e/users/sng/pictures/'
var imageDict;

init();

async function buildImageProps(imageFiles) {
    imageDict = new Object();
    for (var i = 0; i < imageFiles.length; i++) {
        console.log("Reading image", i, "of", imageFiles.length)
        try {
            var shortPath = '/images/' + imageFiles[i].split(imageBasePath)[1]
            imageDict[shortPath] = (await avgColors.getAverageColor(imageFiles[i])).value
        } catch(e) {
            console.log(e)
        }   
    } 
}

async function init () {
    const imageFiles = getImagesRecursive(imageBasePath)
    app.use("/images", express.static(imageBasePath))
    app.use(express.static(__dirname))

    if (fs.existsSync("./image_props.json")) {
        imageDict = JSON.parse(fs.readFileSync("image_props.json"))
    } else {
        await buildImageProps(imageFiles);
        fs.writeFileSync("image_props.json", JSON.stringify(imageDict));
    }    

    var server = app.listen(3000, () => {
        console.log("Running server...")
    })


    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, "/index.html"))
    })

    app.get('/images', function (req, res) {
      res.send(imageDict)
    })

}


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