// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  //make a copy of imgIn to resulting 
  resultImg.copy(imgIn,0,0,imgIn.width, imgIn.height,0,0,imgIn.width, imgIn.height);
  //pass resultImginto sepiaFilter
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  // resultImg = radialBlurFilter(resultImg);
  // resultImg = borderFilter(resultImg)
  return resultImg;
}

function sepiaFilter(img){
  img.loadPixels();
  for(var i = 0; i < img.width; i++){
    for(var x = 0; x < img.height; x++){

      //get each pixel RGB value
      var pixelIndex = ((img.width * x)+ i)* 4;
      var oldRed = img.pixels[pixelIndex + 0];
      var oldGreen = img.pixels[pixelIndex + 1];
      var oldBlue = img.pixels[pixelIndex + 2];

      //compute new RGB value
      var newRed = (oldRed * .393) + (oldGreen * .679) + (oldBlue * .189);
      var newGreen = (oldRed * .349) + (oldGreen * .686) + (oldBlue * .168);
      var newBlue = (oldRed * .272) + (oldGreen * .534) + (oldBlue * .131);

      //constrain the RGB value to 0 to 255
      newRed = constrain(newRed, 0 ,255);
      newGreen = constrain(newGreen, 0 ,255);
      newBlue = constrain(newBlue, 0 ,255);

      //update each pixel with new RGB values
      img.pixels[pixelIndex+0] = newRed;
      img.pixels[pixelIndex+1] = newGreen;
      img.pixels[pixelIndex+2] = newBlue;
      img.pixels[pixelIndex+3] = 255;


    }
  }
  img.updatePixels();
  return img;
}

function darkCorners(img){
  img.loadPixels();
  var midX = img.width/2;
  var midY = img.height/2;
  //calculate the distance between from (0,0) to center - max distance
  var maxDist = abs(dist(midX,midY,0,0));
  var dynLum = 1;
  for(var x = 0; x < img.width; x++){
    for(var y = 0; y < img.height; y++){
      //calculate the pixel distance away from the center
      var d = abs(dist(midX,midY,x,y));

      if(d>300){
        var pixelIndex = ((img.width * y)+ x)* 4;
        var oldRed = img.pixels[pixelIndex+0];
        var oldGreen = img.pixels[pixelIndex+1];
        var oldBlue = img.pixels[pixelIndex+2];

        if(d<=450){//for 300 to 450 distance
          dynLum = map(d,300,450,1,0.4)
        }
        else{//for above 450 to maxDist
          dynLum = map(d,450,maxDist,0.4,0);
        }
        //constrain dynlum value 0 to 1
        dynLum = constrain(dynLum,0,1);
        //update each pixel with new RGB value 
        img.pixels[pixelIndex+0] = oldRed*dynLum;
        img.pixels[pixelIndex+1] = oldGreen*dynLum;
        img.pixels[pixelIndex+2] = oldBlue*dynLum;
      
      }
    }
  }
  img.updatePixels();
  return img;
}