function setup() {
  var canvasDiv = document.getElementById('myCanvas');
  var width = canvasDiv.clientWidth;
  var height = canvasDiv.clientHeight;

  var sketchCanvas = createCanvas(width,450);
  sketchCanvas.parent('myCanvas');
}

function draw() {
  if (mouseIsPressed){
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 40, 40);

  if (keyIsPressed == true){
    clear();
  }
}


