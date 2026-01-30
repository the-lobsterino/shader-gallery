#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265359
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float l = sign(cos((length(vec2(position-vec2(0.5,0.25)))*50.0+time*2.0)))-cos((length(vec2(position-vec2(0.5,0.25)))*50.0+time*2.0));
	gl_FragColor = vec4( l,l,l, 1.0 );

}