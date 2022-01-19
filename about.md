## About this Work

With 256^3 possibilities, pixels allow for a variety of meaningful works to be rendered on our computer screens. But what constitutes meaning here? Like words to a novel, could pixels contain meaning as well?

This pixelated photomosaic generator asks us how we can recontextualize the relationship between the image and the pixel. What if the pixel contains more meaning in the form of a personal photo than the pixel art it's rendering? As mosaics are built up picture by picture on the site, we may look closer at the details compared to zoomed-out product, which may not even resemble the original image it's trying to emulate. It's a game of balance, creating a picture with a certain number of pictures (high or low resolution in terms of these "megapixels"), and defining the number of literal pixels in each square picture, all at odds with your patience and computer's resources.

Then there's the question of *audience*. Who cares about the pixels if they're not important to you? What about the (lack of) privacy? My mosaics are composed from a library of 20k+ photos collected throughout my life, but perhaps the image that they create are more intriguing, just like with any other (non-pixelated) image. No one needs to look closer if it doesn't seem worth investigating.

Finally, *creativity* and *ownership*. Is the output of this program considered creative when it's just piecing together pre-existing images, based on another pre-existing work? Can the algorithm be considered creative when it derives from other pieces of code for color averaging, color similarity, and source image pixelation? It's hard to say how much of it I own. Even considering the output images, should we look at the megapixels we place in, or the composite image? I may own the pixels that make up the image in this case, but rendering UChicago's logo with them doesn't quite seem like my product. Or worse, using other people's pictures of campus in order to render the UChicago logo. Would I then only "own" the work by virtue of my algorithm? What if someone else were to render a Van Gogh using Wikipedia images with this software? The boundaries of ownership begins to blur as data becomes more and more accessible, pictures fall into the public domain, and code becomes open source.

## How It's Made

This tool was built using Node.js and good ol' HTML, client-side JavaScript, and a touch of CSS. Sure, Python would be a lot faster at generating an output image, but I wanted to meditate on the past as mosaics were being generated in front of me, (at most) five pixels at a time.

In the future, I'm hoping to add an interactive element to the canvas I'm drawing on, hovering over pictures and revealing more about where they're from, and remixing those in turn to explore more of my image gallery.

Some technical details of each step:

1. A folder (or folder of folders) of images are parsed/read, and the average colors of the pictures within are saved into a JSON file for fast(er) lookup.
2. We go to the website we're serving, and we pick the resolution of our image tiles, how pixelated we want our input image to be, and if we want some faster rendering. 
3. We upload an image and go!
4. Courtesy of the [Pixel It](https://github.com/giventofly/pixelit) library, we get what the pixelated version of the image looks like.
5. We begin matching each pixel of that pixelated image to a picture in the library of images. For the algorithmy folks, we're sitting at roughly O(n^2) here, as we minimize the [color difference](https://en.wikipedia.org/wiki/Color_difference#CIELAB_%CE%94E*) of the target pixel and the average color of each image. Looking for ways to improve this (maybe building a search color space of sorts?) for sure!
6. Pixels begin rendering, bit by bit. These are the full size images on the canvas, so feel free to zoom in and admire the past. This step takes some time - mostly due to my hard drive speed and how large the images are. We can preprocess images first, of course, though it's up to you if you want a copy of your entire photo library in reduced size for the purpose of making photo mosaics.
7. After some time, we're done! Images can be saved directly from the canvas element for posterity.

In the spirit of facilitating more creation and iteration, the code is [open source](https://github.com/spencerng/pixel-mosaics).

## Example works

(photos coming soon to GitHub... perhaps)

A test drive of my initial code, abstract enough to for a casual viewer to not know what the larger picture is about. The pixels seem interesting though... they're rendered at a sharp-enough 50x50 pixels.

Here's the largest work I've rendered so far, based on a baby picture of mine from 2001... yet it explores up to 2022 through its pixels. With a scale factor of 16 on a 2272x1704 picture and individual tile sizes of 150x150, the final 13650x10200 product sits at 6210 pictures (over a quarter of my photo library!), ~20 minutes of rendering time, and 322 MB.