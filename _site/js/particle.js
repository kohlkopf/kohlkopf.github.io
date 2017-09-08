function Particle(x,y,amp) {
  this.speed   = random(0.1,0.8);
  this.name    =  "astroid";
  this.color   = color(135,random(120,166),131,random(2,200));
  this.posX     = x;
  this.posY= y;
  this.angle=random(0,360);
  this.size;
  this.amplitude=amp;
  this.sizeAmplitude=random(2,50);
 
  
  this.bounce=function(){
    this.posY=sin(radians(this.angle)) * map(mouseY,0,height,-3,3)*this.amplitude;
    this.posX=cos(radians(this.angle)) *map(mouseX,0,height,-3,3)*this.amplitude;
    this.size=sin(radians(this.angle/2+135))*this.sizeAmplitude;
    this.angle=this.angle+this.speed*changeDir;
   }
    
  this.display=function(){
    
    ellipse(this.posX, this.posY,this.size,this.size);
  }
  
}


var amplitude = 200;
var angle=0;
//sizeAmplitude=50;
var particleVortex=[];
var changeDir=1;

// function mousePressed(){
//   changeDir=changeDir*(-1);
// }



function setup() {
	var canvasDiv = document.getElementById('myCanvas');
	var width = canvasDiv.clientWidth;
	var height = canvasDiv.clientHeight;

	var sketchCanvas = createCanvas(width,450);
	sketchCanvas.parent('myCanvas');
	
	for(var j=0;j<5;j++){
	for(var i=0;i<100;i++){
		particleVortex.push(new Particle(0,0,amplitude-i*8));
  }
    
  }  
}

function draw() {
  background(255); 
  noStroke();  
 // translate(mouseX,mouseY);
   translate(width/2,height/2);
    
  for(var i=0;i<particleVortex.length;i++){
    fill(particleVortex[i].color);
    particleVortex[i].bounce();
  	particleVortex[i].display();
  } 
  
  }