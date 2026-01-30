// 138 byte version: https://www.dwitter.net/d/19953
// more dweets by me: https://www.dwitter.net/u/danny@hille.dk
#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy )*4.;
	float X = position.x;
	float Y = position.y;
	float t = time/44.;
	gl_FragColor = vec4( vec3( sin(t*9.+X*X-Y*Y), sin(t*8.+X*Y), sin(t*9.+X*X+Y*Y)), 1. );

}