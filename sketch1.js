const picSize = 200;
const fastLookup = false;

const reader = new FileReader();
var selector = document.getElementById("mosaicPhoto")
var imageData = undefined;


async function getImageData() {
    imageData = await (await fetch("/images")).json();
}


getImageData();

reader.addEventListener('load', async function(event) {
    var output = document.getElementById("output")
    output.src = event.target.result
    console.log("Fetching image data")
    await output.decode();
    while (imageData === undefined) {
      sleep(250)
    }
    console.log("Fetching image data fetched!")

    const config = {
        from: output,
        to: document.getElementById("pixelitcanvas"),
        scale: document.getElementById('scaleFactor').value,
    }
    const px = new pixelit(config)
    var pixelImage = px.draw().pixelate()
    console.log("Drew pixelated images")
    var canvas = pixelImage.drawto
    var scale = 1 / pixelImage.scale
    document.getElementById("mosaicCanvas").width = Math.round(canvas.width / scale) * picSize
    document.getElementById("mosaicCanvas").height = Math.round(canvas.height / scale) * picSize

    await sleep(1000)
    createMosaic(canvas, pixelImage);
})

selector.onchange = function(e) {
    reader.readAsDataURL(e.target.files[0])
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createMosaic(canvas, pixelImage) {
    console.log("Creating mosaic...")
    var mosaicCtx = document.getElementById("mosaicCanvas").getContext("2d")
    var pixels = []
    var scale = 1 / pixelImage.scale
    var lookup = {}

    for (var y = 0; y < canvas.height; y += scale) {
        var row = []
        for (var x = 0; x < canvas.width; x += scale) {
            var pixel = canvas.getContext("2d").getImageData(x, y, 1, 1).data
            var pixelRGB = [pixel[0], pixel[1], pixel[2]];
            var mostSimilar = undefined;
            if (fastLookup && pixelRGB in Object.keys(lookup)) {
              mostSimilar = lookup[pixelRGB]
            } else {
              var minDelta = 100;
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
              lookup[pixelRGB] = mostSimilar
            }
            
            console.log("Finding pixel ", 
              Math.floor(x / scale) + Math.floor(y / scale) * Math.floor(canvas.width / scale), "of", 
              Math.floor(canvas.width / scale) * Math.floor(canvas.height / scale))
            const load = asyncLimit(addImage, 5);
            load(x, y, mosaicCtx, mostSimilar, scale);
            // console.log(minDelta, x, canvas.width, y, canvas.height)
        }
    }
}

async function addImage(x, y, mosaicCtx, mostSimilar, scale) {
    // Draw most similar image to canvas
    var img = new Image();
    try {
      img.src = mostSimilar;
      img.classList.add("NO-CACHE")
      await img.decode();
      var srcDim = Math.min(img.width, img.height)
      var srcX = img.width / 2 - srcDim / 2
      var srcY = img.height / 2 - srcDim / 2
      var canvDim = picSize;
      mosaicCtx.drawImage(img, srcX, srcY, srcDim, srcDim, Math.round(x / scale) * canvDim, Math.round(y / scale) * canvDim, canvDim, canvDim)
    } catch(e) {
      await addImage(x, y, mosaicCtx, mostSimilar, scale)
    }
    img = undefined
}

// Taken from https://dev.to/ycmjason/limit-concurrent-asynchronous-calls-5bae
const asyncLimit = (fn, n) => {
  let pendingPromises = [];
  return async function (...args) {
    while (pendingPromises.length >= n) {
      await Promise.race(pendingPromises).catch(() => {});
    }

    const p = fn.apply(this, args);
    pendingPromises.push(p);
    await p.catch(() => {});
    pendingPromises = pendingPromises.filter(pending => pending !== p);
    return p;
  };
};