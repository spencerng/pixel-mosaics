const reader = new FileReader();
var output = document.getElementById("output")
var selector = document.getElementById("mosaicPhoto")
var canvas;
var imageData;
var pixelImage;


async function getImageData() {
  imageData = await (await fetch("/images")).json();  
}


reader.addEventListener('load', async function(event) {
    output.src = event.target.result
    await getImageData();
    const config = {
      from: output,
      to: document.getElementById("pixelitcanvas"),
      scale: document.getElementById('scaleFactor').value,
    }
    const px = new pixelit(config)
    pixelImage = px.draw().pixelate()
    canvas = pixelImage.drawto
    
    createMosaic()

    // steps: 
    // 1. recreate pixel grid in reduced size
    // 2. for each pixel, get most similar image
    // 3. draw each image but cropped and in reduced resolution
    // 4. if time, add clickable/zoom in feature
  })

selector.onchange = function(e) {
  reader.readAsDataURL(e.target.files[0])
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createMosaic() {
  console.log("Creating mosaic...")
  var mosaicCtx = document.getElementById("mosaicCanvas").getContext("2d")
  var pixels = []
  var scale = 1 / pixelImage.scale
  document.getElementById("mosaicCanvas").width = canvas.width / scale * 150
  document.getElementById("mosaicCanvas").height = canvas.height / scale * 150
  
  for (var y = 0; y < canvas.height; y += scale) {
    var row = []
    for (var x = 0; x < canvas.width; x += scale) {
      
      var pixel = canvas.getContext("2d").getImageData(x, y, 1, 1).data
      var pixelRGB = [pixel[0], pixel[1], pixel[2]];
      var minDelta = 100;
      var mostSimilar = undefined;
      for (const [image, color] of Object.entries(imageData)) {
        var delta = deltaE(pixelRGB, [color[0], color[1], color[2]])
        if (delta < minDelta) {
          minDelta = delta;
          mostSimilar = image;
        }
        if (delta <= 2) {
          break;
        }
      }
      delete imageData[mostSimilar];
      await (async function addImage(x, y) {
          // Draw most similar image to canvas
          var img = new Image()
          
          img.src = mostSimilar
          await img.decode();
          var srcDim = Math.min(img.width, img.height)
            var srcX = img.width/2 - srcDim/2
            var srcY = img.height/2 - srcDim/2
            var canvDim = 150;
            console.log(img, srcX, srcY, srcDim, srcDim, x / scale * canvDim, y / scale * canvDim, canvDim, canvDim);
            mosaicCtx.drawImage(img, srcX, srcY, srcDim, srcDim, Math.round(x / scale) * canvDim, Math.round(y / scale) * canvDim, canvDim, canvDim)
      })(x, y);
      console.log(minDelta, x,canvas.width, y, canvas.height)
      
      
    }
  }
}