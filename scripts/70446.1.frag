// ????
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float distanceFunction(vec2 pos) {
	return ((dot(pos,pos)));
}

void main( void ) {
	
	vec2 p = surfacePosition;///pow(10.6123456,16.0);
	
	float t = fract(p.y/p.x);
	
	//p *= t;

	p.x = fract(dot(p,p));
	p.y = 1.0-p.x;
	
	vec3 col = vec3( distanceFunction(p) );
	col = fract(col/(vec3(1.0)-col*col)+t*col);

	gl_FragColor = vec4(col, 1.0);
}
