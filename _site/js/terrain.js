// Based on Daniel Shiffman's Coding challenges in Processing
// http://codingrainbow.com
// http://patreon.com/codingrainbow

var cols, rows;
var scl = 20;
var w = 5000;
var h = 1500;

var flying = 0;

var terrain;


var panelParent = document.getElementById('myCanvas');

var panel = QuickSettings.create(600, 100, 'Terrain Controls')
    .addRange("flyingRate", 0.01, 0.5, 0.05, 0.01, draw)
    .addRange("peak", 10, 250, 75, 1)
    .addRange("valley", -250, -10, -75, -1);



function setup() {
    var canvasDiv = document.getElementById('backgroundCanvas');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var sketchCanvas = createCanvas(width, height, "webgl");
    sketchCanvas.parent('backgroundCanvas');

    cols = w / scl;
    rows = h / scl;

    // make a 2d array
    terrain = [];
    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
    }


}

function draw() {

    flying += panel.getValue('flyingRate');
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1, panel.getValue("valley"), panel.getValue("peak"));
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
