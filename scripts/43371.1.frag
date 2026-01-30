// by rodger 2017
// random code by patricio g.v. (@particiogv)
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 col	= vec3(.5,	.5,	.5);

const vec2 randvec = vec2(12.9898,78.233);
const float randconst = 43758.5453123;
float random (vec2 st) { return fract(sin(dot(st,randvec))*randconst); }

void main( void ) {
	vec2 position = (gl_FragCoord.xy/resolution.xy);

	float x = position.x;
	float y = position.y;
	position.x *= y /= time;
	position.y *= x /= time;

	gl_FragColor = vec4(col*random(position.xy),1.0);
}