// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg

var imgIn;
var imgOut;
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
  resultImg = sepiaFilter(resultImg);
  resultImg = darkCorners(resultImg);
   resultImg = radialBlurFilter(resultImg);
   resultImg = borderFilter(resultImg)
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

function borderFilter(img){

  var tempImg = createGraphics(img.width, img.height);
  tempImg.image(img,0,0);

  tempImg.noFill();
  tempImg.stroke(255);
  tempImg.strokeWeight(20);
  tempImg.rect(0,0,img.width,img.height,50);

  tempImg.noFill();
  tempImg.stroke(255);
  tempImg.strokeWeight(20);
  tempImg.rect(0,0,img.width,img.height);

  return tempImg;

}

function radialBlurFilter(img){
  img.loadPixels();

  for(var x = 0; x < img.width; x++){
    for(var y = 0; y <img.height; y++){
      var pixelIndex = ((img.width * y)+ x)* 4;
      var oldRed = img.pixels[pixelIndex+0];
      var oldGreen = img.pixels[pixelIndex+1];
      var oldBlue = img.pixels[pixelIndex+2];

      var c = convolution(x,y,matrix,matrix.length,img);

      var mouseDist = abs(dist(x,y,mouseX,mouseY));
      var dynBlur = map(mouseDist,100,300,0,1);
      dynBlur = constrain(dynBlur,0,1);

      //calculate new RBG value
      var newRed = c[0]*dynBlur + oldRed*(1-dynBlur)
      var newGreen = c[1]*dynBlur + oldGreen*(1-dynBlur)
      var newBlue = c[2]*dynBlur + oldBlue*(1-dynBlur)

      //update each pixel with new RGB value 
      img.pixels[pixelIndex+0] = newRed;
      img.pixels[pixelIndex+1] = newGreen;
      img.pixels[pixelIndex+2] = newBlue;
    
    }
  }
  img.updatePixels();
  return img; 
}

function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue = 0.0;
  var offset = floor(matrixSize / 2);

  // convolution matrix loop
  for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
          // Get pixel loc within convolution matrix
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (xloc + img.width * yloc) * 4;
          // ensure we don't address a pixel that doesn't exist
          index = constrain(index, 0, img.pixels.length - 1);

          // multiply all values with the mask and sum up
          totalRed += img.pixels[index + 0] * matrix[i][j];
          totalGreen += img.pixels[index + 1] * matrix[i][j];
          totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
  }
  // return the new color as an array
  return [totalRed, totalGreen, totalBlue];
}

function greyScale(img)
{
    img.loadPixels();
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0]
                    var oldGreen=img.pixels[pixelIndex+1]
                    var oldBlue=img.pixels[pixelIndex+2];
                    //averge of all the three colours are stored in variable grey
                    var grey=(oldRed+oldGreen+oldBlue)/3
              		// red, green and blue to hold the value of variable grey
              		img.pixels[pixelIndex+0]=grey;
              		img.pixels[pixelIndex+1]=grey;
              		img.pixels[pixelIndex+2]=grey;
              		img.pixels[pixelIndex+3]=255;
                    
                }  
        }
   		img.updatePixels();
    	return img;
}

function negative(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0]
                    var oldGreen=img.pixels[pixelIndex+1]
                    var oldBlue=img.pixels[pixelIndex+2];
              		//subtracting the values of oldRed, oldGreen and oldBlue from white
              		img.pixels[pixelIndex+0]=255-oldRed;
              		img.pixels[pixelIndex+1]=255-oldGreen;
              		img.pixels[pixelIndex+2]=255-oldBlue;
             		img.pixels[pixelIndex+3]=255;
                    
                }  
        }
    	img.updatePixels();
    	return img;
}

function redFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldRed=img.pixels[pixelIndex+0];
              		//setting oldRed to its orignal while other holds 0
              		img.pixels[pixelIndex+0]=oldRed;
              		img.pixels[pixelIndex+1]=0;
              		img.pixels[pixelIndex+2]=0;
              		img.pixels[pixelIndex+3]=255;        
                    
                }  
        }
		img.updatePixels();
    	return img;
}

function greenFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldGreen=img.pixels[pixelIndex+1]            
              		img.pixels[pixelIndex+0]=0;
              		//setting oldGed to its orignal while other holds 0
              		img.pixels[pixelIndex+1]=oldGreen;
              		img.pixels[pixelIndex+2]=0;
              		img.pixels[pixelIndex+3]=255;        
                    
                }  
        }
    	img.updatePixels();
    	return img;
}

function blueFilter(img)
{
    img.loadPixels();
    
    for(var x=0;x<img.width;x++)
        {
            for(var y=0;y<img.width;y++)
                {
                    var pixelIndex=((img.width*y)+x)*4;
                    var oldBlue=img.pixels[pixelIndex+2];

              		img.pixels[pixelIndex+0]=0;
              		img.pixels[pixelIndex+1]=0;
              		//setting oldBlue to its orignal while other holds 0
              		img.pixels[pixelIndex+2]=oldBlue;
              		img.pixels[pixelIndex+3]=255;          
                }  
        }
    	img.updatePixels();
    	return img;
}



function keyPressed()
{
   
    if (keyCode === LEFT_ARROW) 
    {
        image(greyScale(imgIn), imgIn.width, 0);
        preload();
    }
    
   if (keyCode === RIGHT_ARROW) 
    {      
        image(negative(imgIn), imgIn.width, 0);
        preload();
    }
    
	if (keyCode === UP_ARROW) 
    {      
        image(radialBlurFilter(imgIn), imgIn.width, 0);
        preload();
    }
    if (keyCode === 82) 
    {      
        image(redFilter(imgIn), imgIn.width, 0);
        preload();
    }
     if (keyCode === 71) 
    {      
        image(greenFilter(imgIn), imgIn.width, 0);
        preload();
    }
     if (keyCode === 66) 
    {      
        image(blueFilter(imgIn), imgIn.width, 0);
        preload();
    }

}
