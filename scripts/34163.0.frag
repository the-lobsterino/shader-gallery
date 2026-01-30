#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float top(float x, float y) {
	if (x > y) { 
		return x + 0.0; 
	} else { 
		return y + 0.0; 
	}
}

float test(float x, float y) {
	return x;
}

float square(float x) {
	return x * x;
}

void main( void ) {
	
	float dist = sqrt( square(surfacePosition.x - mouse.x) + square(surfacePosition.y - mouse.y) );
	float red = top(0.0, 255.0 / top(1.0, sqrt(dist) * sqrt(sqrt(dist)) * 1000.0));
	
	gl_FragColor = vec4(red, 0.0, 0.0, 0.0);
}