//http://glslsandbox.com/e#72285

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.14159265359;
const float PI2 = PI*2.;
const float PI2_inv = 0.159154943091895335768883763372;

vec2 polar(vec2 p) {
	return vec2(length(p),-atan(p.y,-p.x)+PI);
}

/*
mat2 mat2Rotate2(float a){
	return mat2(
		vec2(cos(a),-sin(a)), //column 1st
		vec2(sin(a),cos(a)) //column 2nd
		);
}
mat2 mat2Scale2(float s){
	return mat2(s); //all diagnoal values
}
vec2 rotate(vec2 p, float a) {
	return mat2Rotate2(a) * p;
}

float sphere(vec2 p, vec2 o, float r) {
	return step(distance(o,p) - r,0.);
}*/

float world(vec2 pp, float i) {
	const float ad = 6.; //angle divisions
	return abs(cos((pp.r*pow(2.,i))*PI2*4.)+cos((pp.g*pow(2.,i))*ad))/2.;
}

void main( void ) {

	vec2 p = surfacePosition;
	vec3 c = vec3(0.);
	vec2 pp = polar(p);
		
	c.g = world(pp,0.);
	for (float i=1.; i<5.; i++) {
		if (abs(c.g) < sin(time)*.5+.5) {
			c.g = world(pp,i);
		}
	}
	gl_FragColor = vec4(c,1.);

}