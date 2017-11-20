// Based on Daniel Shiffman's Coding challenges in Processing, adapted by Kohl Kinning
// http://codingrainbow.com
// http://patreon.com/codingrainbow

var cols, rows;
var scl = 60;
var w = 5000;
var h = 1000;

var flying = 0;

var terrain;


function setup() {
    var canvasDiv = document.getElementById('broad-canvas');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var sketchCanvas = createCanvas(width, width*.2, "webgl");
    sketchCanvas.parent('broad-canvas');

    cols = w / scl;
    rows = h / scl;

    // make a 2d array
    terrain = [];
    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
    }

}

function draw() {

    flying += 0.02; 
    var yoff = flying;
    var peak = 145;
    var valley = -500;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1, peak, valley); 
            xoff += 0.2;
        }
        yoff += 0.2;
    }

    rotateX(-PI / 3);
    translate(-w / 2, height / 2);
    for (var y = 0; y < rows - 1; y++) {
        beginShape();
        stroke('rgba(0,255,0,0.25)')
        for (var x = 0; x < cols - 1; x++) {
            vertex(x * scl, y * scl, terrain[x][y]);
            vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
            vertex((x + 1) * scl, (y + 1) * scl, terrain[x + 1][y + 1]);
            vertex((x + 1) * scl, y * scl, terrain[x + 1][y]);
        }
        endShape();
    }
}
