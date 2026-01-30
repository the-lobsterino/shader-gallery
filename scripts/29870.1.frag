#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float norm(float value, float min, float max) {
	return (value - min) / (max - min);
}

float lerp(float norm, float min, float max) {
	return min + norm * (max - min);
}

float map(float value, float sourceMin, float sourceMax, float destMin, float destMax) {
	return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}


void main( void ) {	
	float delta = map(sin(time * 2.), -1.0, 1.0, 1.0, 1500.0);
	
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	
	float r = (sin(map(cos(x / 50.) * sin(y / 50.), 0.0, resolution.x, 0.0, delta * 3.14)) + 1.0) / 2.0;
	float g = map(cos(time * 2.), -1., 1., 0., 1.);
	float b = (cos(map(sin(x / 50.) * cos(y / 50.), 0.0, resolution.x, 0.0, delta * 3.14)) + 1.0) / 2.0;
	
	gl_FragColor = vec4(r, g, b, 1.0 );
}