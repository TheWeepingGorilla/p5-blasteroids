var s = function( p ) {

	function Thing() {
		this.angle = 0;
		this.angularVelocity = 0;
		this.angularAcceleration = 0;

		this.location = p.createVector(0, 0);
		this.velocity = 0;
		this.acceleration = 0;

		this.setLocation = function(x, y) {
			this.location.x = x;
			this.location.y = y;
		}
	}

	function TriangleShip() {
		Thing.call(this);

		this.drawMe = function() {
			p.translate(this.location.x, this.location.y);
			p.strokeWeight(4);
			p.stroke('red');
			p.fill('green');
			p.triangle(0, -24, -12, 24, 12, 24);
		}
	}
	TriangleShip.prototype = Object.create(Thing.prototype);

	var objects = [];
	objects[0] = new TriangleShip();
	objects[0].setLocation(p.windowWidth / 2, p.windowHeight / 2);

	p.setup = function() {
		p.frameRate(60);
		p.createCanvas(p.windowWidth, p.windowHeight);
	}

	p.draw = function() {
		// paint background and save default drawing location (0,0)
		p.background(0);
		p.push();

		objects[0].drawMe();

		// restore default drawing location (0,0)
		p.pop();
	}

	// auto-resize canvas to window size
	p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
};

var myp5 = new p5(s,'sketch');