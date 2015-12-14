var a = function( p ) {

	function Thing() {
		this.angle = 0;
		this.angularVelocity = 0;
		this.angularVelocityLimit = 0;

		this.location = p.createVector(0, 0);
		this.velocity = p.createVector(0, 0);
		this.thrust = 0;

		this.controller = 'program';

		this.setLocation = function(x, y) {
			this.location.x = x;
			this.location.y = y;
		}

		this.applyThrust = function() {
			// note: thrust is applied where the Thing is pointing, which for some Things (e.g. piloted ships)
			// isn't usually the direction it's currently going so we need to find the x and y for the current
			// angle of the Thing and apply the thrust in the correct direction
			var x = p.cos(this.angle);
			var y = p.sin(this.angle);
			var vecToAdd = p.createVector(x,y);
			vecToAdd.rotate(this.thrust[0].directionOffset);
			vecToAdd.mult(this.thrust[0].strength);
			this.velocity = this.velocity.add(vecToAdd);
		}

		this.rotate = function(direction) {
			this.angularVelocity = this.angularVelocity + (this.rotation.strength * direction);
			if (Math.abs(this.angularVelocity) >= this.rotation.angularVelocityLimit) {
				if (this.angularVelocity <= 0) {
					this.angularVelocity = -this.rotation.angularVelocityLimit;
				}
				else {
					this.angularVelocity= this.rotation.angularVelocityLimit;
				}
			}
		}

		this.rotationDamping = function() {
			if (this.angularVelocity > 0) {
				this.angularVelocity = this.angularVelocity - this.rotation.damping;
				if (this.angularVelocity <= 0) {
					this.angularVelocity = 0;
				}
			}
			if (this.angularVelocity < 0) {
				this.angularVelocity = this.angularVelocity + this.rotation.damping;
				if (this.angularVelocity >= 0) {
					this.angularVelocity = 0;
				}
			}
		}

		this.move = function() {
			this.angle = this.angle + this.angularVelocity;
			this.location = this.location.add(this.velocity);
		}
	}

	function TriangleShip() {
		Thing.call(this);

		this.thrust = [{strength: 0.2, directionOffset: 0}];
		this.rotation = {strength: Math.PI / 64, damping: .05, angularVelocityLimit: .2};

		this.drawMain = function() {
			p.strokeWeight(4);
			p.stroke(240);
			p.line(24, 0, -16, -12);
			p.line(-16, -12, 0, 0);
			p.line(0, 0, -16, 12);
			p.line(-16, 12, 24, 0);
		}

		this.drawThrust = function() {
			p.strokeWeight(2);
			p.stroke(240);
			p.line(-8, 4, -24, 0);
			p.line(-24, 0, -8, -4);
		}
	}
	TriangleShip.prototype = Object.create(Thing.prototype);

	function Player() {
		this.thrust = 87;
		this.rotateCounterclockwise = 65;
		this.rotateClockwise = 68;
		this.name = 'playerOne';
	}

	function Level(args) {
		this.top = args.top;
		this.left = args.left;
		this.bottom = args.bottom;
		this.right = args.right;

		this.checkBoundaries = function(thing) {
			this.top(thing);
			this.left(thing);
			this.bottom(thing);
			this.right(thing);
		}
	}

	var players = [];
	players[0] = new Player();

	var objects = [];
	objects[0] = new TriangleShip();
	objects[0].setLocation(p.windowWidth / 2, p.windowHeight / 2);
	objects[0].controller = players[0];

	wrapTop = function(thing) {
		if (thing.location.y < 0) {
			thing.location.y = p.windowHeight;
		}
	}

	wrapLeft = function(thing) {
		if (thing.location.x < 0) {
			thing.location.x = p.windowWidth;
		}
	}

	wrapBottom = function(thing) {
		if (thing.location.y > p.windowHeight) {
			thing.location.y = 0;
		}
	}

	wrapRight = function(thing) {
		if (thing.location.x > p.windowWidth) {
			thing.location.x = 0;
		}
	}

	var levels = [];

	levels[0] = {top: wrapTop, left: wrapLeft, bottom: wrapBottom, right: wrapRight};

	var level = new Level(levels[0]);

	p.setup = function() {
		p.frameRate(60);
		p.createCanvas(p.windowWidth, p.windowHeight);
	}

	p.draw = function() {
		p.push();
		p.background(0);

		for (i=0; i<objects.length; i++) {
			p.push();
			// draw object at present position
			p.translate(objects[i].location.x, objects[i].location.y);
			p.rotate(objects[i].angle);
			objects[i].drawMain();

			// get movement inputs and apply
			if (objects[i].controller = players[0]) {
				if (p.keyIsDown(players[0].thrust)) {
					objects[i].drawThrust();
					objects[i].applyThrust();
				}
				if (p.keyIsDown(players[0].rotateCounterclockwise)) {
					objects[i].rotate(-1);
				}
				if (p.keyIsDown(players[0].rotateClockwise)) {
					objects[i].rotate(1);
				}
				if ( (! p.keyIsDown(players[0].rotateCounterclockwise)) && (! p.keyIsDown(players[0].rotateClockwise)) ) {
					objects[i].rotationDamping();
				}
			}
			// move object
			objects[i].move();
			level.checkBoundaries(objects[i]);
			p.pop();
		}
		p.pop();
	}

	// auto-resize canvas to window size
	p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
};

var sketch = new p5(a,'sketch');