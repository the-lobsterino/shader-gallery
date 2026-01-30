#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 coords = gl_FragCoord;
	// coords -= vec4(resolution.x,0,0,0)/2.0;
	float r = 1.0 - abs(sin((coords.y-coords.x) / 100.0));
	float g = abs(cos((2.0/acos(r)*coords.x) / 100.0));
	float b = abs(sin((coords.x*r) / 100.0));
	gl_FragColor = vec4(sin(r*b),cos(b/g),sin(b/r),1);
}