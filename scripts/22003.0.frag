#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy)/128.0 + mouse*180.0;
	float shift_g = 2.0*M_PI/3.0;
	float shift_b = 2.0*shift_g;
	float r = (sin(position.x)+1.0) / 2.1;
	float g = (sin(position.x+shift_g)+1.0) / 2.1;
	float b = (sin(position.x+shift_b)+1.0) / 2.1;
	gl_FragColor = vec4( r, g, b, 1.0 );

}