// Eki

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

	struct Square {
		vec2 center;
		float width;
		float height;
	};

	struct Circle {
		vec2 center;
		float r;
	};

bool isInSquare(vec2 p, Square square) {
	return (p.x > square.center.x - square.width / 2.0) && (p.x < square.center.x + square.width / 2.0) 
		&& (p.y > square.center.y - square.height / 2.0) && (p.y < square.center.y + square.height / 2.0);
}

bool isInCircle(vec2 p, Circle circle) {
	bool isInside = false;
	
	
	
	return isInside;
}

void main( void ) {

	vec2 pos = surfacePosition;
	Square square;
	square.center.x = cos(time) * 0.2;
	square.center.y = sin(time) * 0.2;
	square.width = 0.5;
	square.height = 0.5;
	
	if(isInSquare(pos, square)) {
		gl_FragColor = vec4(cos(time), cos(time), cos(time), 1.0);
	} else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}

}