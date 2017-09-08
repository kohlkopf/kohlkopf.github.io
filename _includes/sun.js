size(600, 400);
    background(255);
    colorMode(HSB);

    var a = 0.99;

    //draw mountains
    var xoff = 1;

    var drawMountain = function(offset, increase, clr) {
        stroke(140, 100, clr);
        var offset = offset;
        var yoff = 0;
        for(var i = 0; i < width; i++) {
            var y = noise(yoff, xoff)*100;
            line(i, offset+y, i, height);
            yoff += increase;
        }
    };

    //draw sun

    var x = 0;
    var y = 40;

    var drawSun = function() {
        noStroke();
        fill(10, 225, 225);
        ellipse(x, y, 40, 40);
    };

    draw = function() {
        var bgChange = sin(a)*20;
        var bg = map(bgChange, -20, 20, 40, 255);
        fill(140, 60, bg);
        noStroke();
        rect(0, 0, width, height);
        //background(225);

        drawSun();
        x += 1.2;
        y += 0.4;

         if (x > width+300) {
            x = -40;
            y = 40;
        }
        xoff += 0.01;

        drawMountain(190, 0.003, 160);
        drawMountain(200, 0.01, 100);
        drawMountain(210, 0.006, 60);
        drawMountain(220, 0.02, 30);

        a += 0.007;
};
