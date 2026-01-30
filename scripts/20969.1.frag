#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159

float toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += PI;
	return a;
}

void main( void ) {

	vec2 p = surfacePosition;
	float a1 = toPolar(p); //range 0 to 2*PI
	float a2 = atan(p.x,p.y); //range -PI to PI
	float a = a1;
	float r = length(p);
	
	vec3 col = vec3(0);
	
	//col = vec3(a1/PI/2.);
	//col = vec3(a2/PI+1.);
	
	col = vec3(step(0.,r-0.5*(sin(a*2.)*sin(a*10.))),step(0.,p.x),step(0.,p.y));
	
	gl_FragColor = vec4( col, 1.0 );
}