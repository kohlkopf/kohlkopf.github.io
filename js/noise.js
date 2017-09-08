// Otso Sorvettula

var z = 0; // create variable for noise z

function  setup() {
  var canvasDiv = document.getElementById('myCanvas');
  var width = canvasDiv.clientWidth;
  var height = 550;
  
  var sketchCanvas = createCanvas(width,550);
  sketchCanvas.parent('myCanvas');
}

function draw() {
    noStroke();
    fill(0, 0, 0, 10);
    rect(0,0,height,width);

    // float y = 0; creates decimal variable y and assigns value 0 to it
    // loop repeats as long as y < height; is true
    // y = y + 20 increments y in the end of each iteration.
    for (var y = 0; y < height; y = y + 20) {
        
    	stroke(map(y * ((sin(frameCount/10)+1)/2) , 0, height, 0, 255), map(y * ((sin(frameCount/40)+1)/2) , 0, height, 0, 255), 255, 100);
        // float x = 0; creates decimal variable x and assigns value 0 to it
        // loop repeats as long as x < width; is true
        // x = x + 1 increments the x in the end of each iteration.
        for (var x = 0; x < width; x = x + 1) {
            point(x, y + map(noise(x/150, y/150, z), 0, 1, -100, 100));
        }
    }
    // when y is 500 the program will move forward. In this case increment z
    z = z + 0.02;
}