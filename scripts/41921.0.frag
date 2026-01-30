#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
void main( void ) {

	vec2 p = surfacePosition;
	float r = 0.;
	
	#define _ r += atan(p.x,p.y); if(p.y < -1./2.){p -= sign(p)/2.;} p *= 2.;
	
	_;_;_;_;
	
	if(dot(p,p) < 0.1) gl_FragColor = vec4(1);

}