#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 st = surfacePosition;//gl_FragCoord.xy/resolution;
	float t = dot(st,st);
	float t2 = cos(128.0*abs(sin(64.0*t*cos(t))));
	t2 = fract( t2 );
	gl_FragColor = vec4(t2,t2,t2,1.0);

}
