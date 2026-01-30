#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define PI 3.1415926535897932384626433832795


void main(void) {

	vec2 pos = surfacePosition*20.;
	float a = atan(pos.x,pos.y)+time;
	a  = mod(a,PI/6.);
	float r = length(pos);
	a  = mod(a,2./r);
	
	float c=a*(1.+r);
	
	gl_FragColor = vec4(vec3(c*.5),1.);
}
