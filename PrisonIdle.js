
var prisoner;
var walls = [];

var TILESIZE = 40;
var GRAVITY = .2;

function preload() {
  
}

function setup() {
    createCanvas(1280, 720);
    
    prisoner = new Prisoner();
    walls.push(new Wall(600, 680, 120, 40));
    walls.push(new Wall(720, 640, 80, 80));
    walls.push(new Wall(800, 600, 80, 40));
    walls.push(new Wall(920, 600, 40, 120));
}

function draw() {
    background(0);
    
    for (var i = 0; i < walls.length; i++) {
        walls[i].display();
    }
    
    prisoner.display();
    prisoner.update();
}

function Prisoner() {
    var pWidth = TILESIZE * (9/10);
    var pHeight = (2*TILESIZE) * (5/6);
    
    var loc = createVector(width/2, height/2);
    var vel = createVector(0, 0);
    var horizontalAcceleration = .5;
    var jumpAcceleration = 4.5;
    var maxHorizontalSpeed = 3;
    var inAir = true;
    var jumpReleased = true;
  
    this.display = function() {
        push();
        translate(loc.x, loc.y);
        noStroke();
        fill(250, 164, 78); // orange
        rect(0, 0, pWidth, pHeight);
        pop();
    }
    
    this.update = function() {
        var horizontalKeyPressed = false;
        var onFloor = false;
        
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (!inAir) vel.x -= maxHorizontalSpeed;
            else vel.x -= horizontalAcceleration/2;
            horizontalKeyPressed = true;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (!inAir) vel.x += maxHorizontalSpeed;
            else vel.x += horizontalAcceleration/2;
            horizontalKeyPressed = true;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            if (jumpReleased && !inAir) {
                vel.y -= jumpAcceleration;
                jumpReleased = false;
            }
        } else {
            jumpReleased = true;   
        }
        
        vel.y += GRAVITY;
        if (vel.x > maxHorizontalSpeed) vel.x = maxHorizontalSpeed;
        if (vel.x < -maxHorizontalSpeed) vel.x = -maxHorizontalSpeed;
        
        // Check window borders
        if (loc.x + vel.x < 0) {
            loc.x = 0;
            vel.x = 0;
        }
        if (loc.y + vel.y < 0) {
            loc.y = 0;
            vel.y = 0;
        }
        if (loc.x + vel.x + pWidth > width) {
            loc.x = width - pWidth;
            vel.x = 0;
        }
        if (loc.y + vel.y + pHeight > height) {
            loc.y = height - pHeight;
            vel.y = 0;
            if (!horizontalKeyPressed) vel.x = vel.x/1.3;
            onFloor = true;
        }
        
        for (var i = 0; i < walls.length; i++) {
            // Right Wall
            if (loc.x + vel.x < walls[i].getX() + walls[i].getWidth() && loc.x + vel.x > walls[i].getX() && loc.y + pHeight > walls[i].getY() && loc.y < walls[i].getY() + walls[i].getHeight()) {
                loc.x = walls[i].getX() + walls[i].getWidth();
                vel.x = 0;
                //console.log("1");
            }
            // Ceiling
            if (loc.y + vel.y < walls[i].getY() + walls[i].getHeight() && loc.y + vel.y > walls[i].getY() && (loc.x > walls[i].getX() - pWidth && loc.x < walls[i].getX() + walls[i].getWidth())) {
                loc.y = walls[i].getY() + walls[i].getHeight();
                vel.y = 0;
                //console.log("2");
            }
            // Left Wall
            if (loc.x + vel.x + pWidth > walls[i].getX() && loc.x + vel.x < walls[i].getX() && (loc.y > walls[i].getY() - pHeight && loc.y < walls[i].getY() + walls[i].getHeight())) {
                loc.x = walls[i].getX() - pWidth;
                vel.x = 0;
                //console.log("3");
            }
            // Floor
            if (loc.y + vel.y + pHeight > walls[i].getY() && loc.y + vel.y < walls[i].getY() && (loc.x > walls[i].getX() - pWidth && loc.x < walls[i].getX() + walls[i].getWidth())) {
                loc.y = walls[i].getY() - pHeight;
                vel.y = 0;
                if (!horizontalKeyPressed) vel.x = vel.x/1.3;
                onFloor = true;
                //console.log("4");
            }
        }
        
        //console.log("vel.x = " + vel.x + "   vel.y = " + vel.y);
        if (!onFloor) inAir = true;
        else inAir = false;
        loc.x += vel.x;
        loc.y += vel.y;
    }
}

function Wall(xLoc, yLoc, wWidth, wHeight) {
    var loc = createVector(xLoc, yLoc);
    
    this.display = function() {
        push();
        translate(loc.x, loc.y);
        noStroke();
        fill(250, 87, 78); // red
        rect(0, 0, wWidth, wHeight);
        pop();
    }
    
    this.getX = function() {
        return loc.x;   
    }
    
    this.getY = function() {
        return loc.y;   
    }
    
    this.getWidth = function() {
        return wWidth;   
    }
    
    this.getHeight = function() {
        return wHeight;   
    }
}