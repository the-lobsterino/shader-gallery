#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.141592653589793234
#define pi2 pi*2.0

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float ang = cos(atan(-position.y+0.25,position.x-0.5));
	gl_FragColor = vec4( vec3( cos(time+ang),cos(time+pi2*(1./3.)+ang),cos(time+pi2*(2./3.))+ang), 1.0 );
}