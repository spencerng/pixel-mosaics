const reader = new FileReader();
var output = document.getElementById("output")
var selector = document.getElementById("mosaicPhoto")

reader.addEventListener('load', async function(event) {
    output.src = event.target.result
    await sleep(100);
    const config = {
      from: output,
      to: document.getElementById("pixelitcanvas"),
      scale: 8,
    }
    const px = new pixelit(config)
    px.draw().pixelate()
    console.log(px)
  })

selector.onchange = function(e) {
  reader.readAsDataURL(e.target.files[0])
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}