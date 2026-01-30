#ifdef GL_ES
precision mediump float;
#endif


// Vd - 09/15/'14 2 - Yes, another one. \\


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float c = 0.0;
	c = p,x;
	
	gl_FragColor = vec4( c, c, c, 1.0 );
	