# Pixel Mosaics

Node.js and web implementation of a custom photomosaic generator, rendered live!

Note that this is still a work in progress - lots of performance improvements to be made!

## Setup

1. Clone this repository (download it as a zip): `git clone https://github.com/spencerng/live-photomosaics.git`
2. Modify `imageBasePath` in `app.js` with the *absolute* file directory path that contains all the photos you wish to use in your photomosaic(s). We'll then recursively look through the folder for possible images! (This step might take some time.)
3. Run `node app.js`
4. Navigate to `localhost:3000` on your web browser, configure your scale size (1-50, lower = lower resolution), your tile size (resolution per tile), then choose an image to begin! Note that the algorithm first takes some time to select appropriate pictures, then begins rendering pixels in your browser.

## About

For some ramblings about the artistic concept and thoughts behind this work, see [this file](about.md).