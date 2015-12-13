var a = function( p ) {

	function Thing() {
		this.angle = 0;
		this.angularVelocity = 0;
		this.angularAcceleration = 0;
		this.angleLimit = 0;

		this.location = p.createVector(0, 0);
		this.velocity = p.createVector(0, 0);
		this.thrust = 0;

		this.controller = 'program';

		this.setLocation = function(x, y) {
			this.location.x = x;
			this.location.y = y;
		}

		this.applyThrust = function() {
			// note: thrust is applied where the Thing is pointing,
			// which for some Things (e.g. piloted ships)
			// isn't usually the direction it's currently going
			// so we need to find the x and y for the current angle of the Thing
			// and apply the thrust in the correct direction
			var x = p.cos(this.angle);
			var y = p.sin(this.angle);
			var vecToAdd = p.createVector(x,y);
			vecToAdd.rotate(this.thrust[0].directionOffset);
			vecToAdd.mult(this.thrust[0].strength);
			this.velocity = this.velocity.add(vecToAdd);
			console.log(this.velocity);
		}

		this.rotate = function(rotation) {
			this.angle = this.angle + rotation;
			if (Math.abs(this.angle) >= this.angleLimit) {
				if (this.angle <= 0) {
					this.angle = -this.angleLimit;
				}
				else {
					this.angle = this.angleLimit;
				}
			}
			console.log(this.angle);
		}
	}

	function TriangleShip() {
		Thing.call(this);

		this.thrust = [{strength: .01, directionOffset: 0}];
		this.angleLimit = .2;

		this.drawMain = function() {
			p.strokeWeight(4);
			p.stroke(240);
			p.line(0, -24, -12, 16);
			p.line(-12, 16, 0, 0);
			p.line(0, 0, 12, 16);
			p.line(12, 16, 0, -24);
		}

		this.drawThrust = function() {
			p.strokeWeight(2);
			p.stroke(240);
			p.line(-4, 8, 0, 24);
			p.line(0, 24, 4, 8);
		}
	}
	TriangleShip.prototype = Object.create(Thing.prototype);

	function Player() {
		this.thrust = 87;
		this.rotateCounterclockwise = 65;
		this.rotateClockwise = 68;
		this.name = 'playerOne';
	}

	var players = [];
	players[0] = new Player();

	var objects = [];
	objects[0] = new TriangleShip();
	objects[0].setLocation(p.windowWidth / 2, p.windowHeight / 2);
	objects[0].controller = players[0];

	p.setup = function() {
		p.frameRate(60);
		p.createCanvas(p.windowWidth, p.windowHeight);
	}

	p.draw = function() {
		p.background(0);

		for (i=0; i<objects.length; i++) {
			p.translate(objects[i].location.x, objects[i].location.y);
			p.rotate(objects[i].angle);
			objects[i].drawMain();
			p.translate(-objects[i].location.x, -objects[i].location.y); // reset to 0,0
			if (objects[i].controller = players[0]) {
				if (p.keyIsDown(players[0].thrust)) {
					objects[i].drawThrust();
					objects[i].applyThrust();
				}
				if (p.keyIsDown(players[0].rotateCounterclockwise)) {
					objects[i].rotate(-p.PI / 64);
				}
				else if (p.keyIsDown(players[0].rotateClockwise)) {
					objects[i].rotate(p.PI / 64);
				}
				else {
					objects[i].angle = 0;
				}
			}
		}
	}

	// auto-resize canvas to window size
	p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
};

var sketch = new p5(a,'sketch');