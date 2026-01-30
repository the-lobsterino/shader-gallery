#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 mouse;
#define time (0.1*time+dot(surfacePosition, mouse-.5))

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.x ) - vec2(0.5, 0.5*resolution.y/resolution.x);
	float val = pos.x * pos.x + pos.y * pos.y;
	float edge = 0.01 + sin(time*5.0) * 0.01;
	edge += sin(acos(pos.x/sqrt(val))*mod(time*2.0,30.0)) * 0.005;
	edge = mix(edge, sin(acos(pos.x/sqrt(val))*mod(time*2.0,30.0)) * 0.005, 2.*cos(time/2.));
	vec3 colour = mix(vec3(cos(time*5.3),sin(time*5.0),tan(time*5.)),vec3(tan(time*7.3),cos(time*7.0),sin(time*7.)),step(edge,val));
	
	gl_FragColor = vec4( colour, 1.0 );
}