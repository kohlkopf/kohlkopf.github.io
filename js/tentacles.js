/* Length of the tentacle */
var len = 60

function setup() {

  var canvasDiv = document.getElementById('pane');
  var width = canvasDiv.clientWidth;
  var height = canvasDiv.clientHeight;
  
  var sketchCanvas = createCanvas(width, height);
  sketchCanvas.parent('myCanvas');

  stroke(135, 146, 131);
  noFill();
}

function draw() {
  background(255);
  translate(width/2, height/2);
  /* First loop is for the tentacles to be located on a cirlce */
  for (var i = 0; i < 360; i+=30) {
    var x = float(sin(radians(i)) * 50);
    var y = float(cos(radians(i)) * 50);
    /* Second loop is for the tentacles */
    for(var q = 0; q < len; q+=2){
      /* The angle is to make the movement */
      var angle = float(cos(radians(len-q+frameCount)) * q);
      var x2 = float(sin(radians(i-angle))*(q*3));
      var y2 = float(cos(radians(i-angle))*(q*3));
      /* fill(255-q*3); */
      ellipse(x+x2, y+y2, len-q, len-q);
    }
  }
}
